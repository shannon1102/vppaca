import Quill from "quill";
import {
  LEAD_FORM_DEFAULT_ID,
  leadFormPreset,
} from "@/lib/content/lead-form-embed";

// Quill's BlockEmbed typing is loose across versions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockEmbed = Quill.import("blots/block/embed") as any;

class LeadFormBlot extends BlockEmbed {
  static blotName = "leadForm";
  static tagName = "div";
  static className = "rich-lead-form";

  static create(value?: string) {
    const node = super.create() as HTMLElement;
    const formId = value?.trim() || LEAD_FORM_DEFAULT_ID;
    const preset = leadFormPreset(formId);
    node.setAttribute("data-form", formId);
    node.setAttribute("contenteditable", "false");
    const span = document.createElement("span");
    span.className = "rich-lead-form__placeholder";
    span.textContent = `📋 ${preset.title}`;
    node.appendChild(span);
    return node;
  }

  static value(node: HTMLElement) {
    return node.getAttribute("data-form") || LEAD_FORM_DEFAULT_ID;
  }
}

let registered = false;

export function registerLeadFormBlot() {
  if (registered || typeof window === "undefined") return;
  Quill.register(LeadFormBlot);
  registered = true;
}
