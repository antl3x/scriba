/* -------------------------------------------------------------------------- */
/*                                ILLMProvider                                */
/* -------------------------------------------------------------------------- */

export interface ILLMProvider<VendorCli = unknown> {
  '<meta>': {
    '<vendor>': 'Scriba' | 'OpenAI' | 'Anthropic' | 'Google' | 'Local'
    '<vendorCli>': VendorCli
  }
}
