import HeaderComponent from '../components/header'

export function FullLayout({ children }) {
    return(
        <div>
            <HeaderComponent/>
            { children }
        </div>
    )
}

export function EmptyLayout({ children }) {
    return(
        <>
            { children }
        </>
    )
}