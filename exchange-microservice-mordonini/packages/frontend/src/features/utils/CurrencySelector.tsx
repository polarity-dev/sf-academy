import { Select, SelectProps } from "antd";
import { FunctionComponent } from "react";
import { CurrencyType } from "../../services/openapi";
import { mapObjectToAntdSelect } from "./generic";

/**
 * A Currency selector
 * @param props Antd "Select" properties
 * @returns 
 */
export const CurrencySelector: FunctionComponent<SelectProps> = (props) => {
    return (
        <Select 
            {...props}
            options={props.options || mapObjectToAntdSelect(CurrencyType)}
            placeholder={props.placeholder || "Select currency"}
        />
    )
}