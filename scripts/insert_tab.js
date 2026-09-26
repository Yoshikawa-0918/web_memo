const TAB_STR = '    ' // インデント文字列（半角スペース2文字。'\t' や '    ' に変更可能）

document.addEventListener('keydown', e => {
  if (e.target.tagName !== 'TEXTAREA' || e.keyCode !== 9) return

  e.preventDefault()
  const textarea = e.target
  const val = textarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // 1. テキストを選択していない場合（単一カーソル位置でのインデント / 削除）
  if (start === end) {
    if (!e.shiftKey) {
      // カーソル位置に直接タブ（TAB_STR）を挿入（空行・文字入力あり問わず動作）
      textarea.value = val.substring(0, start) + TAB_STR + val.substring(end)
      textarea.setSelectionRange(start + TAB_STR.length, start + TAB_STR.length)
    } else {
      // Shift + Tab: カーソル直前の文字が TAB_STR と一致していれば削除
      const before = val.substring(0, start)
      if (before.endsWith(TAB_STR)) {
        textarea.value = before.substring(0, before.length - TAB_STR.length) + val.substring(end)
        textarea.setSelectionRange(start - TAB_STR.length, start - TAB_STR.length)
      }
    }
    return
  }

  // 2. 複数行またはテキストを選択している場合（従来通りの範囲行インデント処理）
  const slct = { left: start, right: end }
  const lineStart = val.substring(0, slct.left).split('\n').length - 1
  const lineEnd = val.substring(0, slct.right).split('\n').length - 1
  const lines = val.split('\n')

  for (let i = lineStart; i <= lineEnd; i++) {
    if (!e.shiftKey) {
      // 行頭にタブ挿入
      lines[i] = TAB_STR + lines[i]
      slct.left += (i === lineStart) ? TAB_STR.length : 0
      slct.right += TAB_STR.length
    } else if (lines[i].startsWith(TAB_STR)) {
      // 行頭のタブ削除
      lines[i] = lines[i].substring(TAB_STR.length)
      slct.left -= (i === lineStart) ? TAB_STR.length : 0
      slct.right -= TAB_STR.length
    }
  }

  textarea.value = lines.join('\n')
  textarea.setSelectionRange(slct.left, slct.right)
})