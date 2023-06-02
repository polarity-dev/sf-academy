import { Outlet, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../user/userSlice"
import routes from "../routes/routes.json"
import { useEffect } from "react"

export const Auth = () => {
    const userState = useAppSelector(selectUser)
    const navigator = useNavigate()
    
    // Redirect user if logged in
    useEffect(() => { 
        if (userState.id && userState.id > 0) navigator(routes.userPanel)
    })
    return (
        <div>
            <Outlet/>
        </div>
    )
}