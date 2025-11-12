import { forwardRef } from 'react'
import classNames from 'classnames'
import { CgSpinner } from 'react-icons/cg'
import type { CSSProperties, ElementType, ReactNode } from 'react'

export interface SpinnerProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
    color?: string
    enableTheme?: boolean
    indicator?: ElementType
    isSpining?: boolean
    size?: string | number
}

const Spinner = forwardRef((props: SpinnerProps, ref) => {
    const {
        className,
        color,
        enableTheme = true,
        indicator: Component = CgSpinner,
        isSpining = true,
        size = 20,
        style,
        ...rest
    } = props

    const spinnerColor =
        color || (enableTheme ? 'primary-500' : 'gray-500')

    const spinnerStyle = {
        height: size,
        width: size,
        ...style,
    }

    const spinnerClass = classNames(
        isSpining && 'animate-spin',
        spinnerColor && `text-${spinnerColor}`,
        className
    )

    return (
        <Component
            ref={ref}
            style={spinnerStyle}
            className={spinnerClass}
            {...rest}
        />
    )
})

Spinner.displayName = 'Spinner'

export default Spinner
