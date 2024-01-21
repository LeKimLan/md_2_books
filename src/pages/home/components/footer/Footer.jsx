import React from 'react'
import './footer.scss'
import pictures from '@pictures'

export default function Footer() {
	return (
		<>
			<footer>
				<div className='footer_content'>
					<div className='logo'>
						<img src={pictures.logo} />
						<h2>Morning Readings</h2>
					</div>
					<div className='links'>
						<div className='contacts_btn'>contact btn</div>
						<div className='contacts_link'>contacts</div>
						<div className='address'>address</div>
					</div>
					<div className='map'>
						<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1173.7120121382527!2d106.69848905867505!3d10.77463348424112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3891ddce57%3A0xa649c9415f9c11da!2sGeneral%20Science%20Library%20of%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1703332665386!5m2!1sen!2s" width="300" height="260" style={{ border: "0" }} loading="lazy" ></iframe>
					</div>
				</div>
			</footer>
		</>
	)
}
