import React from "react"

type Props = {
    children: | JSX.Element
    | JSX.Element[]
    | string
    | string[];
}

export const TypographyH1:React.FC<Props> = ({ children }) => {
    return (
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {children}
      </h1>
    )
  }
export const TypographyH2:React.FC<Props> = ({ children }) => {
    return (
        <h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
        {children}
      </h2>
    )
  }
export const TypographyH3:React.FC<Props> = ({ children }) => {
    return (
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    )
  }
export const TypographyH4:React.FC<Props> = ({ children }) => {
    return (
        <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
    )
  }
export const TypographyP:React.FC<Props> = ({ children }) => {
    return (
        <p className="leading-7 [&:not(:first-child)]:mt-6 w-full break-all">
        {children}
      </p>
    )
  }
export const TypographyLead:React.FC<Props> = ({ children }) => {
    return (
        <p className="text-xl text-slate-700 dark:text-slate-400">
       {children}
      </p>
    )
  }
export const TypographyLarge:React.FC<Props> = ({ children }) => {
    return (
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
      {children}
    </div>
    )
  }
export const TypographySmall:React.FC<Props> = ({ children }) => {
    return (
        <small className="text-sm font-medium leading-none">{children}</small>
    )
  }
  
export const TypographySubtle:React.FC<Props> = ({ children }) => {
    return (
        <p className="text-sm text-slate-500 dark:text-slate-400">
      {children}
    </p>
    )
  }
  
