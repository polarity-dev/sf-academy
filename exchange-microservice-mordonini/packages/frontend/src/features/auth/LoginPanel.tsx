import { Form, Input, Button } from 'antd'

import { useAppDispatch } from '../../app/hooks';
import { Login } from '../../services/openapi';
import { setUserState } from '../user/userSlice'
import { doLoginUser } from '../../services/api';
import { setAuthState } from './authSlice';
import { Link } from 'react-router-dom';
import routes from '../routes/routes.json'

export function LoginPanel() {
    const dispatch = useAppDispatch();

    const onFinish = (values: Login) => doLoginUser(values).then(resp => {
        dispatch(setUserState(resp.user))
        dispatch(setAuthState({accessToken: resp.token}))
    })
    return (
        <div>
            <Form
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
                
                <Form.Item>
                    <Button 
                        type="primary"
                        htmlType='submit'
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
            or <br/>
            <Link to={routes.signup}>Signup</Link>
        </div>
    )
}
