import React from 'react';
import "../../assets/styles/ContactUs.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faDirections } from '@fortawesome/free-solid-svg-icons';
import genelMudurlukImage from '../../assets/images/bilgeadam_genel_mudurluk.jpg';
import ankaraImage from '../../assets/images/bilgeadam_ankara.jpg';
import kadikoyImage from '../../assets/images/bilgeadam_kadikoy.jpg';
import maslakImage from '../../assets/images/bilgeadam_maslak.jpg';

const branches = [
  {
    name: 'BilgeAdam Genel Müdürlük',
    address: 'Reşitpaşa Neighborhood, Katar Street, Teknokent ARI 3 No: 4 B3, Sarıyer / Istanbul',
    phone: '0850 201 60 00​',
    image: genelMudurlukImage,
    mapLink: 'https://maps.app.goo.gl/WW4zcfzLLaix6khEA',
  },
  {
    name: 'BilgeAdam Ankara',
    address: 'Ankara Technology Development Zone, Block G, Üniversiteler Neighborhood, Beytepe Lodumlu Village Road Street No: 91, 06800 Bilkent, Çankaya / ANKARA',
    phone: '444 33 30',
    image: ankaraImage,
    mapLink: 'https://maps.app.goo.gl/xjKt9Ks2EUrTmxz56',
  },
  {
    name: 'BilgeAdam Maslak',
    address: 'Maslak Neighborhood, Taşyoncası Street, Maslak 1453 Block F1 No: 1G Floor: 8, 34398 Sarıyer / Istanbul​',
    phone: '444 33 30',
    image: maslakImage,
    mapLink: 'https://maps.app.goo.gl/rqi4TTQZP2Z9Jcv77',
  },
  {
    name: 'BilgeAdam Kadıköy',
    address: 'Caferağa Neighborhood, Mühürdar Street No: 76, Kadıköy / Istanbul',
    phone: '444 33 30',
    image: kadikoyImage,
    mapLink: 'https://maps.app.goo.gl/Yr182P4mvbLKpAfUA',
  },
];

const ContactUs = () => {
  return (
    <div className="contact-us">
      <div className="branch-cards">
        {branches.map((branch, index) => (
          <div className="branch-card" key={index}>
            <img src={branch.image} alt={branch.name} className="branch-image" />
            <h2>{branch.name}</h2>
            <div className="info-container">
              <p className="address">
                <span className="icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </span>
                {branch.address}
              </p>
            </div>
            <button className="directions-button" onClick={() => window.open(branch.mapLink, '_blank')}>
              <FontAwesomeIcon icon={faDirections} /> Yol Tarifi Al
            </button>
            <button className="phone-button" onClick={() => alert(`Calling ${branch.phone}`)}>
              <FontAwesomeIcon icon={faPhone} /> {branch.phone}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;
