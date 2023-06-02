import { XMLValidationError } from "./errors";
import { ExchangeList, Rate } from "../services/exchange";
import { XMLParser, XMLValidator} from 'fast-xml-parser';

// Labels of XML attributes
const ECB_XML_OBJECT_LABEL = 'gesmes:Envelope'
const ECB_XML_TIME_LABEL = '@_time'
const ECB_XML_CURRENCY_LABEL = '@_currency'
const ECB_XML_RATE_LABEL = '@_rate'

/**
 * Download XML document from European central bank containing every exchange rate which is daily-updated.
 * @param xml xml document as a string
 * @returns a list of exchange rates and the time of its retrieval
 */
export const parseECBData = (xml: string): ExchangeList => {
    // Validate XML
    if (XMLValidator.validate(xml) !== true){
        throw new XMLValidationError("XML validation error. The XML file is invalid!")
    }

    // Parse XML
    const parser = new XMLParser({ignoreAttributes: false})
    const xmlObj = parser.parse(xml)
    // Get API-DateTime
    const ratesTime = xmlObj[ECB_XML_OBJECT_LABEL].Cube.Cube[ECB_XML_TIME_LABEL]
    // Get nested object
    const ratesObj = xmlObj[ECB_XML_OBJECT_LABEL].Cube.Cube.Cube
    const obj: Array<Rate> = ratesObj.map((rate: { [x: string]: string; }) => ({
        currency: rate[ECB_XML_CURRENCY_LABEL],             // e.g 'USD' 
        rate: parseFloat(rate[ECB_XML_RATE_LABEL])          // float rate
    }))
    return {
        exchangeRates: obj,
        time: ratesTime
    }
}