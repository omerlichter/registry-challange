import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import { App, Button, type ButtonProps } from 'antd'
import { useEffect, useState } from 'react'

interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'icon' | 'children'> {
  text: string
  label?: string
}

/** Copies `text` to the clipboard and briefly confirms it. */
export function CopyButton({ text, label = 'Copy', ...buttonProps }: CopyButtonProps) {
  const { message } = App.useApp()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      message.success(`Copied “${text}”`)
    } catch {
      message.error("Couldn't access the clipboard. Select the text and copy it manually.")
    }
  }

  return (
    <Button
      {...buttonProps}
      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
      onClick={handleCopy}
      aria-label={`${label}: ${text}`}
    >
      {copied ? 'Copied' : label}
    </Button>
  )
}
