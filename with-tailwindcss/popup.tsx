import { useReducer } from "react"
import { Storage, useStorage } from "@plasmohq/storage"


import "./style.css"
import {
	GoogleAuthProvider,
	User,
	browserLocalPersistence,
	onAuthStateChanged,
	setPersistence,
	signInWithCredential
} from "firebase/auth"
import { useEffect, useState } from "react"

import { auth } from "./firebase"

setPersistence(auth, browserLocalPersistence)

function IndexPopup() {
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState<User>(null)
	const [userId, setUserId] = useStorage<string>("userId");

	const onLogoutClicked = async () => {
		if (user) {
			await auth.signOut()
		}
	}

	const onLoginClicked = () => {
		chrome.identity.getAuthToken({ interactive: true }, async function (token) {
			if (chrome.runtime.lastError || !token) {
				console.error(chrome.runtime.lastError.message)
				setIsLoading(false)
				return
			}
			if (token) {
				const credential = GoogleAuthProvider.credential(null, token)
				try {
					await signInWithCredential(auth, credential)
				} catch (e) {
					console.error("Could not log in. ", e)
				}
			}
		})
	}

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (typeof user !== null) {
				setUserId(user.uid)
				setIsLoading(false)
				setUser(user)
			}
		})
	}, [user])

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: 16
			}}>
			<h1>
				Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
			</h1>
			{!user ? (
				<button
					onClick={() => {
						setIsLoading(true)
						onLoginClicked()
					}}>
					Log in
				</button>
			) : (
				<button
					onClick={() => {
						setIsLoading(true)
						onLogoutClicked()
					}}>
					Log out
				</button>
			)}
			<div>
				{isLoading ? "Loading..." : ""}
				{!!user ? (
					<div>
						Welcome to Plasmo, {user.displayName} your email address is{" "}
						{user.email}
					</div>
				) : (
					""
				)}
			</div>
		</div>
	)
}

export default IndexPopup


// function IndexPopup2() {
// 	const [openCount, increase] = useStorage<number>("open-count", (storedCount) =>
// 		typeof storedCount === "undefined" ? 0 : storedCount)

// 	const [checked, setChecked] = useStorage("checked", true)


//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         padding: 16
//       }}>
//       <button
// 				onClick={() => increase(openCount + 1)}
//         type="button"
//         className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//         Count:
//         <span className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
// 					{openCount}
//         </span>
// 			</button>
// 			<input
// 				type={"checkbox"}
// 				checked={checked}
// 				onChange={(e) => setChecked(e.target.checked)}
// 			/>
//     </div>
//   )
// }

// export default IndexPopup2
