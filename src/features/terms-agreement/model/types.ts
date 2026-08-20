export interface TermItem {
  id: string
  title: string
  required: boolean
  content: string
}

export interface TermsAgreementResult {
  requiredAgreed: boolean
  optionalAgreed: Record<string, boolean>
}

export interface TermsDialogProps {
  onConfirm: (result: TermsAgreementResult) => void
  onOpenChange: (open: boolean) => void
  open: boolean
  terms?: TermItem[]
}