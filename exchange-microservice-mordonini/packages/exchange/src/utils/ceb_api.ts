import { ExchangeList } from '../services/exchange';
import { parseECBData } from '../utils/xml_parser';
import axios from 'axios';

// Link where ECB posts the XML containing the rates. It updates daily
const DAILY_ECB_RATES_URL = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'


export const getRates = async (): Promise<ExchangeList> => {
    // Retrieve data from europe central bank
    const xml_doc: string = (await axios.get(DAILY_ECB_RATES_URL)).data

    const exchangeRateList = parseECBData(xml_doc)
    return exchangeRateList
}