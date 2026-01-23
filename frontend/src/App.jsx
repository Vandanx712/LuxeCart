import Page from './routes/Page'
import { Provider } from 'react-redux'
import store  from './redux/store'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Provider store={store}>
        <Toaster position="top-center" reverseOrder={false} />
        <Page />
      </Provider>
    </>
  )
}

export default App
