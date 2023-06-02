import { useAppSelector } from "../../app/hooks"
import { UserCard } from "./User"
import { Button } from "antd"
import { selectUser } from "./userSlice"
import { selectAuth } from "../auth/authSlice"
import { OpenAPI } from "../../services/openapi"
import { useEffect } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import routes from "../routes/routes.json"

export const UserPanel = () => {
    const userState = useAppSelector(selectUser)
    const navigate = useNavigate()

    const authState = useAppSelector(selectAuth)

    useEffect(() => { 
        // Redirect user if logged in
        if (!userState.id || userState.id < 0) navigate(routes.login)


        // Set Authentication Header everytime the component is loaded
        OpenAPI.TOKEN = authState.accessToken 
    })
    return (
        <div>
            <UserCard />

            <Button>
                <Link to={routes.logout}>
                    Logout
                </Link>
            </Button>
            <Outlet />
        </div>
    )
}
