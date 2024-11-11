import React, { useState } from 'react';
import "../../assets/styles/AboutUs.scss";
import img1 from '../../assets/images/hr-photo-1.jpg';
import img2 from '../../assets/images/hr-photo-2.jpg';
import img3 from '../../assets/images/hr-photo-3.jpg';
const AboutUs = () => {
    return (
        <div className="about-container">
        <div className="info-box">
          <div>
          <h2>Bilge Adam Academy</h2>
            <p>
            BilgeAdam Academy, the most established and largest institution in Turkey providing education on software and technologies used in professional life, offers not only theoretical knowledge but also practical experience through its instructors, who have hands-on expertise. The training provided is engaging, application-oriented, and enjoyable rather than monotonous. With thousands of graduates, BilgeAdam Academy is the most preferred technology training institution in Turkey, offering both individual and corporate training at its three branches located in Istanbul (Kadıköy, Maslak) and Ankara.
            </p>
            <p>
            Selected 10 times by Microsoft as the "Learning Solutions Partner of the Year," BilgeAdam Academy is also one of the 50 members of the Leading Learning Partner Association (LLPA), each of which is a leading IT training institution in its own country.
            </p>
          </div>
           <img src={img1} alt="hr-photo" className="right-image" />
        </div>
  
        <div className="info-box">
        <img src={img3} alt="hr-photo" className="left-image" />
          <div>
          <h2>High-Quality Standards</h2>
            <p>
              BilgeAdam Academy is the authorized training center in Turkey for leading brands in their respective fields, such as Microsoft, Adobe, Autodesk, Amazon Web Services (AWS), Huawei, and PMI. Additionally, it is a Microsoft partner with 9 different competencies, signifying superior service quality.
            </p>
            <p>
              With its world-class educational infrastructure and exclusive career services offered to students, BilgeAdam Academy is among the key institutions shaping Turkey’s digital future.
            </p>
            <p>
              Training is conducted with practical models, up-to-date content, and a strong infrastructure, in boutique-style settings with a maximum of 15 students per class, averaging 12 students. Since efficiency drops significantly in larger classes, the academy does not follow the practice of holding lectures in classrooms of 100-200 people, as is common in many higher education institutions.
            </p>
            <p>
              BilgeAdam Academy leverages BilgeAdam Technology’s corporate experience in all its training programs. The Academy’s training content is designed in line with developments in the IT sector and industry needs, facilitating the graduates' adaptation to the sector.
            </p>
            <p>
              Selected 10 times by Microsoft as the "Learning Solutions Partner of the Year," BilgeAdam Academy is also one of the 50 members of the Leading Learning Partner Association (LLPA), each of which is a leading IT training institution in its own country.
            </p>
          </div>
          
        </div>
  
        <div className="info-box">
          <div>
          <h2>Why Choose Us?</h2>
          <ul>
            <li>For over 20 years, Turkey's most preferred IT training institution</li>
            <li>Instructors with industry and practical experience</li>
            <li>Application-based training with up-to-date content covering the latest technologies</li>
            <li>Curriculums tailored to meet the needs of companies, prepared by experts</li>
            <li>Internationally recognized certifications accepted by businesses</li>
            <li>A well-known institution among CIOs, IT managers, and agency executives</li>
            <li>The opportunity to join the lifelong BilgeAdam network</li>
            <li>Qualified participants, 80% of whom are university students or graduates</li>
         </ul>
          </div>
          <img src={img2} alt="hr-photo" className="right-image" />
        </div>
      </div>
    );

};

export default AboutUs;