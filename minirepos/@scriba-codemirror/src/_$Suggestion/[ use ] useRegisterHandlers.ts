import * as $CME from '_$CodeMirror'
import * as $Main from '$Main'

/* --------------------------- _useRegisterHandlers -------------------------- */

export function _useRegisterHandlers() {
  $Main._useStoreOfSettings.subscribe(() => {
    // console.log('ready to bootstrap socket', i);
  })

  $CME._useStoreOfEditor.subscribe(() => {
    // console.log('editor state changed', i);
  })
}
