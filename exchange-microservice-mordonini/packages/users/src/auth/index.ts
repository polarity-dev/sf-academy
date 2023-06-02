import { 
    generateJWT as generateAuthToken,
    verifyJWT as verifyAuthToken
} from './jwt'

import { UserPermissions } from './permissions'

export default { generateAuthToken, verifyAuthToken, UserPermissions }
export { UserPermissions }