import RouteIndex from './routes/RouteIndex'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { userAction } from '@slices/user.slice'
import {productAction} from '@slices/product.slice'
import {categoryAction} from '@slices/category.slice'
import { commentAction } from '@slices/comment.slice'
import { accountAction } from '@slices/account.slice'
import utils from '@utils'
import apis from '@services/apis'
import './main.scss'
import './i18n'

export default function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		try {
			if (localStorage.getItem("token")) {
				let data = utils.token.decodeToken(localStorage.getItem("token"));
				if (!data) {
					localStorage.removeItem("token")
					return
				}
				apis.userApi.findByEmailOrUserName(data.userName)
					.then(res => {
						if (res.data[0].updateAt != data.updateAt) {
							localStorage.setItem("token", utils.token.createToken(res.data[0]))
							return
						}
						dispatch(userAction.setData(data))
					})
					.catch(err => {
						console.log(err)
						localStorage.removeItem("token")
						return
					})
			}
		} catch (err) {
			console.log(err)
			localStorage.removeItem("token")
		}
	}, [])

	useEffect(() => {
		let data = utils.token.decodeToken(localStorage.getItem("token"));
		apis.receiptApi.findReceiptByUserId(data.id)
			.then(res => {
				let cart = null;
				let receipts = [];
				for (let i in res.data) {
					if (res.data[i].status == "browsing") {
						cart = res.data[i]
					} else {
						receipts.push(res.data[i])
					}
				}
				dispatch(userAction.setCart(cart))
				dispatch(userAction.setReceipts(receipts))
			})
	}, [])

	useEffect( () => {
		apis.productApi.findAll()
			.then(res => {
				dispatch(productAction.setData(res.data))
			})
	}, [])

	useEffect( () => {
		apis.accountApi.findAccount()
			.then(res => {
				dispatch(accountAction.setData(res.data))
			})
	}, [])

	useEffect( () => {
		apis.userApi.findComment()
			.then(res => {
				dispatch(commentAction.setData(res.data))
			})
	}, [])

	useEffect(() => {
		apis.categoryApi.findAll()
			.then(res => {
				dispatch(categoryAction.setData(res.data))
			})
	}, [])

	return (
		<>
			<RouteIndex />
		</>
	)
}
