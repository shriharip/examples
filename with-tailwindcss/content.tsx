import cssText from "data-text:~style.css"
import type { PlasmoContentScript } from "plasmo"
import { useEffect, useReducer, useState } from "react"
import { db, auth } from "./firebase"
import { setDoc, doc } from "firebase/firestore"
import { onAuthStateChanged, User } from "firebase/auth"
import { useStorage } from "@plasmohq/storage"


export const config: PlasmoContentScript = {
	matches: ["<all_urls>"],
	all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
	const [count, increase] = useReducer((c) => c + 1, 0)
	const [userId, setUserId] = useStorage<string>("userId");

	useEffect(() => {
		console.log(userId)
	}, [])

	const addDB = () => {

		let usersDoc = doc(db, "users", '2')
		try {
			setDoc(usersDoc, {
				count: count
			}, { merge: true })
		} catch (e) {
			console.error(e)
		}
	}


	return (
		<>

			<div className="flex flex-col justify-center items-center h-screen">

      <button
					onClick={() => { increase(); addDB() }}
        type="button"
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Count:
        <span className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
          {count}
        </span>
      </button>
			</div>
		</>
  )
}

export default PlasmoOverlay
