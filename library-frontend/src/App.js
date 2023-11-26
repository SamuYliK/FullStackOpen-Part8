import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Notify from "./components/Notify"
import NavigationMenu from "./components/NavigationMenu"
import Recommend from "./components/Recommend"

import { useApolloClient, useQuery, useSubscription } from "@apollo/client"

import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from "./queries"
import SetBirthYear from "./components/SetBirthYear"

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState("authors")
  const authors = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  })
  const books = useQuery(ALL_BOOKS)
  const me = useQuery(ME, {
    pollInterval: 2000,
  })
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(
        `New book, title: ${addedBook.title} by ${addedBook.author.name} added`
      )

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  if (authors.loading || books.loading || me.loading) {
    return <div>loading data...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  if (page === "login" && token) {
    setPage("authors")
  }

  const favoriteGenre = me.data.me ? me.data.me.favoriteGenre : null

  return (
    <div>
      <NavigationMenu setPage={setPage} token={token} logout={logout} />

      <Notify errorMessage={errorMessage} />

      <Authors show={page === "authors"} authors={authors.data.allAuthors} />

      <Books show={page === "books"} books={books.data.allBooks} />

      <NewBook
        show={page === "add"}
        books={books.data.allBooks}
        token={token}
        setError={notify}
      />

      <SetBirthYear
        show={page === "setBirthYear"}
        authors={authors.data.allAuthors}
        token={token}
      />
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={notify}
        token={token}
        setPage={setPage}
      />
      <Recommend
        show={page === "recommend"}
        token={token}
        genreToSearch={favoriteGenre}
      />
    </div>
  )
}

export default App
