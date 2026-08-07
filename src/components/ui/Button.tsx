'use client'

import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'ghost' | 'white' | 'onRed'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  fullWidth?: boolean
}

interface AnchorProps extends BaseProps {
  href: string
  external?: boolean
  onClick?: never
  type?: never
  disabled?: never
}

interface ActionProps extends BaseProps {
  href?: undefined
  external?: never
  onClick?: () => void
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  disabled?: boolean
}

type ButtonProps = AnchorProps | ActionProps

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-sm',
  lg: 'h-[52px] px-8 text-[15px]',
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-red text-white hover:bg-red-dark shadow-[0_10px_30px_-12px_rgba(200,16,46,0.7)]',
  ghost:
    'border border-white/20 text-white hover:border-white/50 hover:bg-white/5',
  white: 'bg-white text-navy-deep hover:bg-mist',
  // For use inside the solid-red Professional card.
  onRed: 'bg-white text-red hover:bg-mist',
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    fullWidth = false,
  } = props

  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-[0.01em]',
    'transition-all duration-200 ease-out active:scale-[0.985]',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
    sizes[size],
    variants[variant],
    fullWidth && 'w-full',
    className
  )

  if (props.href !== undefined) {
    const externalAttrs = props.external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}
    return (
      <a href={props.href} className={classes} {...externalAttrs}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
    >
      {children}
    </button>
  )
}

export default Button
