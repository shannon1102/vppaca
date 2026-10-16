import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Customer,
  CustomerNote,
  Order,
  Product,
  SiteSettings,
  StockMovement,
  StockMovementReason,
  VatInvoice,
  VatInvoiceLine,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/data/config";
import { getAdminClient } from "@/lib/data/supabase-admin";
import { defaultSettings } from "@/data/seed";
import { normalizePhone } from "@/lib/invoices/vat-math";
import { buildVatLinesFromOrderItems, sumVatLines } from "@/lib/invoices/vat-math";

const DATA_DIR = path.join(process.cwd(), ".data");
const CRM_FILE = path.join(DATA_DIR, "crm.json");

type CrmLocal = {
  customers: Customer[];
  notes: CustomerNote[];
  movements: StockMovement[];
  invoices: VatInvoice[];
  settingsExtras: Partial<SiteSettings>;
};

function adminClient() {
  return getAdminClient();
}

function isMissingTable(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("Could not find the table"))
  );
}

async function readLocal(): Promise<CrmLocal> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(CRM_FILE, "utf8");
    return JSON.parse(raw) as CrmLocal;
  } catch {
    const initial: CrmLocal = {
      customers: [],
      notes: [],
      movements: [],
      invoices: [],
      settingsExtras: {},
    };
    await fs.writeFile(CRM_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

async function writeLocal(db: CrmLocal) {
  await fs.writeFile(CRM_FILE, JSON.stringify(db, null, 2), "utf8");
}

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    tax_code: String(row.tax_code ?? ""),
    address: String(row.address ?? ""),
    customer_type: (row.customer_type as Customer["customer_type"]) ?? "b2c",
    debt_balance: Number(row.debt_balance ?? 0),
    note: String(row.note ?? ""),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapMovement(row: Record<string, unknown>): StockMovement {
  return {
    id: String(row.id),
    product_id: String(row.product_id),
    delta_base: Number(row.delta_base),
    balance_after: Number(row.balance_after),
    reason: row.reason as StockMovementReason,
    reference_type: String(row.reference_type ?? ""),
    reference_id: String(row.reference_id ?? ""),
    note: String(row.note ?? ""),
    created_at: String(row.created_at),
  };
}

function mapInvoice(row: Record<string, unknown>): VatInvoice {
  return {
    id: String(row.id),
    invoice_number: String(row.invoice_number),
    order_id: String(row.order_id),
    customer_id: row.customer_id == null ? null : String(row.customer_id),
    issued_at: String(row.issued_at),
    vat_rate: Number(row.vat_rate),
    subtotal_ex_vat: Number(row.subtotal_ex_vat),
    vat_amount: Number(row.vat_amount),
    total_inc_vat: Number(row.total_inc_vat),
    buyer_name: String(row.buyer_name),
    buyer_tax_code: String(row.buyer_tax_code ?? ""),
    buyer_address: String(row.buyer_address ?? ""),
    buyer_email: String(row.buyer_email ?? ""),
    line_items: (row.line_items as VatInvoiceLine[]) ?? [],
    created_at: String(row.created_at),
  };
}

export async function crmMergeSettings(base: SiteSettings): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb.from("site_settings").select("*").limit(1).maybeSingle();
    if (error || !data) return base;
    return {
      ...base,
      vat_seller_legal_name: String(data.vat_seller_legal_name ?? base.vat_seller_legal_name ?? ""),
      vat_seller_tax_code: String(data.vat_seller_tax_code ?? ""),
      vat_seller_address: String(data.vat_seller_address ?? ""),
      vat_default_rate: Number(data.vat_default_rate ?? base.vat_default_rate ?? 8),
      vat_prices_include_tax: Boolean(
        data.vat_prices_include_tax ?? base.vat_prices_include_tax ?? true,
      ),
      vat_invoice_series: String(data.vat_invoice_series ?? base.vat_invoice_series ?? "1C26TAA"),
      vat_invoice_next_number: Number(data.vat_invoice_next_number ?? 1),
    };
  }
  const local = await readLocal();
  return { ...base, ...defaultSettings, ...local.settingsExtras };
}

export async function crmPatchSettings(patch: Partial<SiteSettings>): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { error } = await sb.from("site_settings").update(patch).neq("id", "00000000-0000-0000-0000-000000000000");
    if (error && !isMissingTable(error)) throw error;
    return;
  }
  const local = await readLocal();
  local.settingsExtras = { ...local.settingsExtras, ...patch };
  await writeLocal(local);
}

export async function crmListCustomers(opts?: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: Customer[]; total: number }> {
  const page = Math.max(opts?.page ?? 1, 1);
  const pageSize = Math.min(Math.max(opts?.pageSize ?? 30, 1), 100);
  const q = (opts?.q ?? "").trim().toLowerCase();

  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("customers")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      if (isMissingTable(error)) return { items: [], total: 0 };
      throw error;
    }
    let items = (data ?? []).map((r) => mapCustomer(r as Record<string, unknown>));
    if (q) {
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.tax_code.includes(q),
      );
    }
    const total = items.length;
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total };
  }

  const local = await readLocal();
  let items = [...local.customers].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  if (q) {
    items = items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.company.toLowerCase().includes(q),
    );
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total };
}

export async function crmGetCustomer(id: string): Promise<Customer | null> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb.from("customers").select("*").eq("id", id).maybeSingle();
    if (error) {
      if (isMissingTable(error)) return null;
      throw error;
    }
    return data ? mapCustomer(data as Record<string, unknown>) : null;
  }
  const local = await readLocal();
  return local.customers.find((c) => c.id === id) ?? null;
}

export async function crmUpsertCustomerFromOrder(order: Order): Promise<Customer> {
  const phoneNorm = normalizePhone(order.customer_phone);
  const now = new Date().toISOString();
  const payload: Omit<Customer, "id"> & { id?: string } = {
    name: order.customer_name,
    phone: order.customer_phone,
    email: order.customer_email,
    company: order.vat_company_name || "",
    tax_code: order.vat_tax_code || "",
    address: order.customer_address,
    customer_type: order.customer_type,
    debt_balance: 0,
    note: "",
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data: existing, error: findErr } = await sb
      .from("customers")
      .select("*")
      .filter("phone", "ilike", `%${order.customer_phone.trim()}%`)
      .limit(5);
    if (findErr && !isMissingTable(findErr)) throw findErr;
    const match =
      (existing ?? []).map((r) => mapCustomer(r as Record<string, unknown>)).find(
        (c) => normalizePhone(c.phone) === phoneNorm,
      ) ?? null;

    if (match) {
      const { data, error } = await sb
        .from("customers")
        .update({
          name: payload.name,
          email: payload.email || match.email,
          company: payload.company || match.company,
          tax_code: payload.tax_code || match.tax_code,
          address: payload.address || match.address,
          customer_type: payload.customer_type,
          updated_at: now,
        })
        .eq("id", match.id)
        .select("*")
        .single();
      if (error) throw error;
      await sb.from("orders").update({ customer_id: match.id }).eq("id", order.id);
      return mapCustomer(data as Record<string, unknown>);
    }

    const id = randomUUID();
    const { data, error } = await sb
      .from("customers")
      .insert({ ...payload, id })
      .select("*")
      .single();
    if (error) throw error;
    await sb.from("orders").update({ customer_id: id }).eq("id", order.id);
    return mapCustomer(data as Record<string, unknown>);
  }

  const local = await readLocal();
  const match =
    local.customers.find((c) => normalizePhone(c.phone) === phoneNorm) ?? null;
  if (match) {
    Object.assign(match, {
      ...payload,
      id: match.id,
      created_at: match.created_at,
      debt_balance: match.debt_balance,
    });
    await writeLocal(local);
    return match;
  }
  const created: Customer = { ...payload, id: randomUUID() };
  local.customers.push(created);
  await writeLocal(local);
  return created;
}

export async function crmSaveCustomer(
  input: Partial<Customer> & { name: string; phone: string },
): Promise<Customer> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    if (input.id) {
      const { data, error } = await sb
        .from("customers")
        .update({ ...input, updated_at: now })
        .eq("id", input.id)
        .select("*")
        .single();
      if (error) throw error;
      return mapCustomer(data as Record<string, unknown>);
    }
    const id = randomUUID();
    const { data, error } = await sb
      .from("customers")
      .insert({
        id,
        name: input.name,
        phone: input.phone,
        email: input.email ?? "",
        company: input.company ?? "",
        tax_code: input.tax_code ?? "",
        address: input.address ?? "",
        customer_type: input.customer_type ?? "b2c",
        debt_balance: input.debt_balance ?? 0,
        note: input.note ?? "",
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapCustomer(data as Record<string, unknown>);
  }

  const local = await readLocal();
  if (input.id) {
    const i = local.customers.findIndex((c) => c.id === input.id);
    if (i < 0) throw new Error("Customer not found");
    local.customers[i] = {
      ...local.customers[i],
      ...input,
      updated_at: now,
    } as Customer;
    await writeLocal(local);
    return local.customers[i];
  }
  const created: Customer = {
    id: randomUUID(),
    name: input.name,
    phone: input.phone,
    email: input.email ?? "",
    company: input.company ?? "",
    tax_code: input.tax_code ?? "",
    address: input.address ?? "",
    customer_type: input.customer_type ?? "b2c",
    debt_balance: input.debt_balance ?? 0,
    note: input.note ?? "",
    created_at: now,
    updated_at: now,
  };
  local.customers.push(created);
  await writeLocal(local);
  return created;
}

export async function crmAddCustomerNote(customerId: string, body: string): Promise<CustomerNote> {
  const note: CustomerNote = {
    id: randomUUID(),
    customer_id: customerId,
    body,
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { error } = await sb.from("customer_notes").insert(note);
    if (error) throw error;
    return note;
  }
  const local = await readLocal();
  local.notes.push(note);
  await writeLocal(local);
  return note;
}

export async function crmListCustomerNotes(customerId: string): Promise<CustomerNote[]> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("customer_notes")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) {
      if (isMissingTable(error)) return [];
      throw error;
    }
    return (data ?? []).map((r) => ({
      id: String(r.id),
      customer_id: String(r.customer_id),
      body: String(r.body),
      created_at: String(r.created_at),
    }));
  }
  const local = await readLocal();
  return local.notes
    .filter((n) => n.customer_id === customerId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function crmRecordStockMovement(input: {
  product_id: string;
  delta_base: number;
  balance_after: number;
  reason: StockMovementReason;
  reference_type?: string;
  reference_id?: string;
  note?: string;
}): Promise<void> {
  const row: StockMovement = {
    id: randomUUID(),
    product_id: input.product_id,
    delta_base: input.delta_base,
    balance_after: input.balance_after,
    reason: input.reason,
    reference_type: input.reference_type ?? "",
    reference_id: input.reference_id ?? "",
    note: input.note ?? "",
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { error } = await sb.from("stock_movements").insert(row);
    if (error && !isMissingTable(error)) throw error;
    return;
  }
  const local = await readLocal();
  local.movements.unshift(row);
  await writeLocal(local);
}

export async function crmListStockMovements(opts?: {
  productId?: string;
  limit?: number;
}): Promise<StockMovement[]> {
  const limit = Math.min(opts?.limit ?? 50, 200);
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    let q = sb.from("stock_movements").select("*").order("created_at", { ascending: false }).limit(limit);
    if (opts?.productId) q = q.eq("product_id", opts.productId);
    const { data, error } = await q;
    if (error) {
      if (isMissingTable(error)) return [];
      throw error;
    }
    return (data ?? []).map((r) => mapMovement(r as Record<string, unknown>));
  }
  const local = await readLocal();
  let list = local.movements;
  if (opts?.productId) list = list.filter((m) => m.product_id === opts.productId);
  return list.slice(0, limit);
}

export async function crmAdjustStock(
  productId: string,
  deltaBase: number,
  note: string,
  getProduct: (id: string) => Promise<Product | null>,
  saveProduct: (p: Product) => Promise<Product>,
): Promise<{ ok: boolean; error?: string; product?: Product }> {
  const p = await getProduct(productId);
  if (!p) return { ok: false, error: "Không tìm thấy sản phẩm." };
  const next = p.stock + deltaBase;
  if (next < 0) return { ok: false, error: "Tồn kho không được âm." };
  const updated = await saveProduct({ ...p, stock: next });
  await crmRecordStockMovement({
    product_id: productId,
    delta_base: deltaBase,
    balance_after: next,
    reason: deltaBase >= 0 ? "receive" : "adjustment",
    reference_type: "manual",
    note,
  });
  return { ok: true, product: updated };
}

export async function crmListInvoices(limit = 30): Promise<VatInvoice[]> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("vat_invoices")
      .select("*")
      .order("issued_at", { ascending: false })
      .limit(limit);
    if (error) {
      if (isMissingTable(error)) return [];
      throw error;
    }
    return (data ?? []).map((r) => mapInvoice(r as Record<string, unknown>));
  }
  const local = await readLocal();
  return local.invoices.slice(0, limit);
}

export async function crmGetInvoiceByOrder(orderId: string): Promise<VatInvoice | null> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("vat_invoices")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();
    if (error) {
      if (isMissingTable(error)) return null;
      throw error;
    }
    return data ? mapInvoice(data as Record<string, unknown>) : null;
  }
  const local = await readLocal();
  return local.invoices.find((i) => i.order_id === orderId) ?? null;
}

export async function crmIssueVatInvoice(
  order: Order,
  settings: SiteSettings,
): Promise<VatInvoice> {
  const existing = await crmGetInvoiceByOrder(order.id);
  if (existing) return existing;

  const vatRate = settings.vat_default_rate ?? 8;
  const lines = buildVatLinesFromOrderItems(
    order.items,
    vatRate,
    settings.vat_prices_include_tax ?? true,
  );
  const totals = sumVatLines(lines);
  const buyerName = order.need_vat_invoice
    ? order.vat_company_name
    : order.customer_name;
  const invoiceNumber = `${settings.vat_invoice_series}-${String(settings.vat_invoice_next_number).padStart(7, "0")}`;

  const invoice: VatInvoice = {
    id: randomUUID(),
    invoice_number: invoiceNumber,
    order_id: order.id,
    customer_id: order.customer_id,
    issued_at: new Date().toISOString(),
    vat_rate: vatRate,
    ...totals,
    buyer_name: buyerName,
    buyer_tax_code: order.vat_tax_code,
    buyer_address: order.need_vat_invoice ? order.vat_address : order.customer_address,
    buyer_email: order.need_vat_invoice ? order.vat_email : order.customer_email,
    line_items: lines,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { error: e1 } = await sb.from("vat_invoices").insert({
      ...invoice,
      line_items: invoice.line_items,
    });
    if (e1) throw e1;
    await sb
      .from("site_settings")
      .update({ vat_invoice_next_number: (settings.vat_invoice_next_number ?? 1) + 1 })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await sb
      .from("orders")
      .update({ accounting_exported_at: new Date().toISOString() })
      .eq("id", order.id);
  } else {
    const local = await readLocal();
    local.invoices.unshift(invoice);
    local.settingsExtras = {
      ...local.settingsExtras,
      vat_invoice_next_number: (settings.vat_invoice_next_number ?? 1) + 1,
    };
    await writeLocal(local);
  }

  return invoice;
}
