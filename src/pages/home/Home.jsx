import { useEffect } from 'react'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { Outlet } from 'react-router-dom'
import './home.scss'

export default function Home() {
	useEffect(() => {
		window.scrollTo(0, 0);
	},[])

	return (
		<div className='home_page'>
			<Header></Header>
			<div className='home_page_body'>
				<div className='body_content'>
					<Outlet />
				</div>
			</div>
			<Footer></Footer>
		</div>
	)
}
