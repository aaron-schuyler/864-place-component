import React, { useEffect, useState, useRef } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import {BrowserView, MobileView} from 'react-device-detect'
import PropTypes from 'prop-types'
import { Styled } from 'direflow-component'
import styles from './App.css'
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css'
import InstagramIcon from './instagram-icon.js'
import FacebookIcon from './facebook-icon.js'

const App = (props) => {
  const [placeData, setPlaceData] = useState(null)
  const [images, setImages] = useState([])
  const mapRef = useRef()
  // const images = [{url: 'https://towncarolina.com/wp-content/uploads/sites/5/2020/11/ReyesWedding_13-scaled.jpg'},{url: 'https://towncarolina.com/wp-content/uploads/sites/5/2020/11/ReyesWedding_633-scaled-e1606335574526.jpg'}]
  useEffect(() => {
    if (mapRef.current) {
      const googleMapScript = document.createElement('script')
      googleMapScript.src=`https://maps.googleapis.com/maps/api/js?key=AIzaSyA2BcbjzrCJ-Bs1tPWIhQtmy5nj7PM_1Ds&libraries=places`
      googleMapScript.async = true
      document.body.appendChild(googleMapScript)
      googleMapScript.addEventListener('load', () => {
        let map = new window.google.maps.Map(mapRef.current, {
          center: {lat: 34.8526, lng: -82.3940},
          zoom: 15
        })
        let service = new window.google.maps.places.PlacesService(map)
        service.getDetails({placeId: props.placeId}, callback)
        function callback(place, status) {
          if (status == window.google.maps.places.PlacesServiceStatus.OK)
            setPlaceData(place)
            const images = []
            place.photos.slice(0, 4).forEach(photo => {
              let url = photo.getUrl(photo)
              images.push({url})
            })
            setImages(images)
        }
      })
    }
  }, [mapRef])

  function renderStarRating() {
    let rating = []
    let numbers = String(placeData.rating).split('.')
    for (let i = 1; i <= numbers[0]; i++) {
      rating.push(
        <div key={i} className='star'><svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24"><g><rect fill="none" height="24" width="24" x="0"/><polygon points="14.43,10 12,2 9.57,10 2,10 8.18,14.41 5.83,22 12,17.31 18.18,22 15.83,14.41 22,10"/></g></svg></div>
      )
    }
    if (numbers[1] > 0) {
      let width = `${numbers[1] * 0.1 * 30}px`
      rating.push(
        <div key={numbers[0] + 1} className='percent-star star' style={{width: width}}><svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24"><g><rect fill="none" height="24" width="24" x="0"/><polygon points="14.43,10 12,2 9.57,10 2,10 8.18,14.41 5.83,22 12,17.31 18.18,22 15.83,14.41 22,10"/></g></svg></div>
      )
    }
    return (
      <div className='google-star-rating'>{rating}</div>
    )
  }

  function renderSplideSlides() {
    return images.map(image => {
      return (
        <SplideSlide key={image.url}>
          <img src={image.url} />
        </SplideSlide>
      )
    })
  }

  function renderHours() {
    return placeData.opening_hours.weekday_text.map(day => {
      return (<li key={day}>{day}</li>)
    })
  }

  function renderOpenStatus() {
    if (placeData.opening_hours.isOpen()) {
      return (<span className='open'>Open</span>)
    } else {
      return (<span className='closed'>Closed</span>)
    }
  }

  function renderDetails() {
    let split = placeData.formatted_address.split(',')
    return (
      <div className='details'>
        <p><a className='web-link' href={placeData.website}>Visit Website</a></p>
        <p><a><InstagramIcon size='40px' /></a><a><FacebookIcon size='40px' /></a></p>
        <p>{split[0]}<br />{split[1]}, {split[2]}</p>
        <p><a href={`tel:${placeData.formatted_phone_number.replace(/\D/g,'')}`}>{placeData.formatted_phone_number}</a></p>
      </div>
    )
  }

  return (
    <Styled styles={[styles, splideStyles]}>
      <div className='app'>
        {placeData && (
          <>
          <h1>{props.placeTitle}</h1>
          {renderStarRating()}
          <div className='row-1'>
            <div className='top-left col'>
              <Splide options={{
                  rewind: true,
                  width: "100%",
                  height: 350,
                  cover: true
                }}>
                {renderSplideSlides()}
              </Splide>
            </div>
          <div className='top-right col'>
            <div className='hours'>
              <h2>Business Hours</h2>
              {renderOpenStatus()}
              <ul>{renderHours()}</ul>
            </div>
          </div>
          </div>
          </>
        )}
        <div className='row-2'>
          <div className='col'>
            <div ref={mapRef} style={{height:'300px'}}></div>
          </div>
          <div className='col center-center'>
            {placeData && renderDetails()}
          </div>
          <div className='col'>
            <div className='ad'><p>Ad Placement</p></div>
          </div>
        </div>
      </div>
    </Styled>
  )
}

App.defaultProps = {
  placeTitle: '',
  placeId: '',
  facebookUrl: '',
  instagramUrl: '',
  featuredImageUrl: '',
  recommendations: [],
  description: ''
}

App.propTypes = {
  placeTitle: PropTypes.string,
  placeId: PropTypes.string,
  facebookUrl: PropTypes.string,
  instagramUrl: PropTypes.string,
  featuredImageUrl: PropTypes.string,
  recommendations: PropTypes.array,
  description: PropTypes.string
}

export default App
