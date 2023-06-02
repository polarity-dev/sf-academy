import { Link } from "react-router-dom"
import routes from "../routes/routes.json"
import { FunctionComponent } from "react"
import { Button, Form, FormProps, Input } from "antd"
import { useAppDispatch } from "../../app/hooks"
import { setUserState } from "../user/userSlice"
import { Signup } from "../../services/openapi"
import { doSignupUser } from "../../services/api"
import { setAuthState } from "./authSlice"

// Type alias
type SignupFormProps = Signup

const SignupForm: FunctionComponent<FormProps> = (props) => {
    const dispatch = useAppDispatch()

    const onFinish = (values: SignupFormProps) => doSignupUser(values)
        .then(resp => {
            dispatch(setUserState(resp.user))
            dispatch(setAuthState({ accessToken: resp.token }))
            console.log("Success!")
        })
        .catch(err => {
            console.error(err)
        })
        
    

    return (
        <Form {...props}
            onFinish={onFinish}
        >
            <Form.Item 
                label='Email'
                name='email'
                required
            >
                <Input type='email'/>
            </Form.Item>

            <Form.Item
                required
                name='password'
                label='Password'
            >
                <Input type='password'/>
            </Form.Item>
            
            <Form.Item
                name='name'
                label='First Name'
            >
                <Input type='text'/>
            </Form.Item>

            <Form.Item
                name='surname'
                label='Surname'
            >
                <Input type='text'/>
            </Form.Item>

            <Form.Item
                required
                name='iban'
                label='IBAN'
            >
                <Input type='text'/>
            </Form.Item>

            <Form.Item>
                <Button 
                    type="primary"
                    htmlType='submit'
                >
                    Signup
                </Button>
            </Form.Item>
        </Form>
    )
}

export const SignupPanel = () => {
    return (
        <div>
            SIGNUP<br />
            <SignupForm />
            <Link to={routes.login}>Already have an account?</Link>
        </div>
    )
}