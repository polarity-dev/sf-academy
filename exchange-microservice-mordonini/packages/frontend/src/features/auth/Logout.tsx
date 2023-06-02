import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../app/hooks"
import { resetUserState } from "../user/userSlice"
import { resetAuthState } from "./authSlice"
import { useEffect } from "react"
import routes from "../routes/routes.json"

export const Logout = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    
    
    useEffect(() => {
        // Remove user & auth data
        dispatch(resetUserState())
        dispatch(resetAuthState())

        // Redirect
        navigate(routes.root)
    })

    return (<div></div>)
}