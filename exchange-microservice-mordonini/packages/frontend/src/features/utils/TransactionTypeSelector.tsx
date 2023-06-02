import { Select, SelectProps } from "antd"
import { FunctionComponent } from "react"
import { TransactionType } from "../../services/openapi"
import { mapObjectToAntdSelect } from "./generic"

/**
 * A TransactionType selector
 * @param props Antd "Select" properties
 * @returns 
 */
export const TransactionTypeSelector: FunctionComponent<SelectProps> = (props) => {
    return (
        <Select 
            {...props}
            options={props.options || mapObjectToAntdSelect(TransactionType)}
            placeholder={props.placeholder || "Select Transaction type"}
        />
    )
}