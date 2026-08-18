// src/features/terms-agreement/ui/terms-dialog.tsx
//
// 약관 동의 팝업 (첨부 이미지 기준)
// shared/components/ui/dialog.tsx (Radix 기반), button.tsx를 그대로 재사용합니다.

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { cn } from "@/shared/lib/utils"

import { TERMS } from "../model/terms"
import type {
  TermItem,
  TermsAgreementResult,
  TermsDialogProps,
} from "../model/types"

type CheckedMap = Record<string, boolean>

function buildInitialCheckedMap(terms: TermItem[]): CheckedMap {
  return terms.reduce<CheckedMap>((acc, term) => {
    acc[term.id] = false
    return acc
  }, {})
}

export function TermsDialog({
  onConfirm,
  onOpenChange,
  open,
  terms = TERMS,
}: TermsDialogProps) {
  const [checkedMap, setCheckedMap] = useState<CheckedMap>(() =>
    buildInitialCheckedMap(terms)
  )

  useEffect(() => {
    if (open) {
      setCheckedMap(buildInitialCheckedMap(terms))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const requiredTerms = useMemo(
    () => terms.filter((term) => term.required),
    [terms]
  )
  const optionalTerms = useMemo(
    () => terms.filter((term) => !term.required),
    [terms]
  )

  const allAgreed = useMemo(
    () => terms.length > 0 && terms.every((term) => checkedMap[term.id]),
    [terms, checkedMap]
  )

  const allRequiredAgreed = useMemo(
    () =>
      requiredTerms.length > 0 &&
      requiredTerms.every((term) => checkedMap[term.id]),
    [requiredTerms, checkedMap]
  )

  const handleToggleAll = (next: boolean) => {
    const nextMap: CheckedMap = {}
    terms.forEach((term) => {
      nextMap[term.id] = next
    })
    setCheckedMap(nextMap)
  }

  const handleToggleOne = (id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleConfirm = () => {
    if (!allRequiredAgreed) {
      return
    }

    const optionalAgreed: Record<string, boolean> = {}
    optionalTerms.forEach((term) => {
      optionalAgreed[term.id] = Boolean(checkedMap[term.id])
    })

    onConfirm({
      optionalAgreed,
      requiredAgreed: true,
    })
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="max-w-[320px] gap-0 rounded-[24px] p-0 sm:max-w-[320px]"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        overlayClassName="bg-black/30"
        showCloseButton={false}
      >
        <div className="px-6 pt-7 pb-6">
          <DialogTitle className="text-[17px] leading-[1.45] font-bold tracking-[-0.17px] text-[#1a1c1e]">
            서비스명을 시작하기 위해
            <br />
            이용약관에 동의해주세요
          </DialogTitle>
          <DialogDescription className="sr-only">
            서비스 이용을 위해 필수 약관에 동의해주세요.
          </DialogDescription>

          <button
            className="mt-5 flex w-full items-center gap-2 border-b border-[#edf1f3] pb-3"
            onClick={() => handleToggleAll(!allAgreed)}
            type="button"
          >
            <CheckCircle checked={allAgreed} />
            <span className="text-[15px] font-semibold text-[#1a1c1e]">
              모두 동의하기
            </span>
          </button>

          <ul className="mt-3 max-h-[168px] space-y-3 overflow-y-auto">
            {terms.map((term) => (
              <li key={term.id}>
                <button
                  className="flex w-full items-center gap-2 text-left"
                  onClick={() => handleToggleOne(term.id)}
                  type="button"
                >
                  <CheckCircle checked={Boolean(checkedMap[term.id])} />
                  <span className="text-[14px] leading-[1.4] text-[#6c7278]">
                    <span className="text-[#9096a1]">
                      [{term.required ? "필수" : "선택"}]
                    </span>{" "}
                    {term.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              className="h-12 w-full rounded-[10px] bg-[#f19ed2] text-[15px] font-semibold tracking-[-0.15px] text-white shadow-none hover:bg-[#ed8dca] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/30"
              disabled={!allRequiredAgreed}
              onClick={handleConfirm}
              type="button"
            >
              시작하기
            </Button>
            <Button
              className="h-12 w-full rounded-[10px] bg-[#f5f6f7] text-[15px] font-medium text-[#6c7278] shadow-none hover:bg-[#edf1f3]"
              onClick={() => onOpenChange(false)}
              type="button"
              variant="secondary"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
        checked ? "bg-[#f19ed2]" : "bg-[#edf1f3]"
      )}
    >
      {checked && (
        <svg className="h-[10px] w-[10px]" fill="none" viewBox="0 0 12 10">
          <path
            d="M1 5L4.5 8.5L11 1.5"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      )}
    </span>
  )
}