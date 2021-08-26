import { sanityClient } from "../../sanity";
import { isMultiple } from "../../utils";
import Image from "../../components/Image"
import Review from "../../components/Review";

export default function Property({
  title,
  location,
  propertyType,
  mainImage,
  images,
  pricePerNight,
  beds,
  bedrooms,
  description,
  host,
  reviews
}) {
    const reviewAmount = reviews.length;
  return (
    <div className="container">
      <h1>{title}</h1>
      <p>
        {reviewAmount} review{isMultiple(reviewAmount)}
      </p>
      <div className="images-section">
        <Image identifier="main-Image" image={mainImage} />
        <div className="sub-images-section">
          {images.map((_key, image) => (
            <Image identifier="image" image={image} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="information">
          <h2>
            {propertyType} hosted by {host?.name}
          </h2>
          <h4>
            {bedrooms} bedroom{isMultiple(bedrooms)} * {beds} bed
            {isMultiple(beds)}
          </h4>
          <hr />
          <h4>Enhanced Clean</h4>
          <p>
            This host is committed to Waterbnb's 5-step enhanced cleaning
            process
          </p>
          <h4>Amenities for everyday living</h4>
          <p>
            This host has equipeed this place for long stays - kitchen, shampoo
            etc.
          </p>
          <h4>House Rules</h4>
          <p>No smoking or pets allowed.</p>
        </div>
        <div className="price-box">
          <h2>${pricePerNight}</h2>
          <h4>
            {reviewAmount} review{isMultiple(reviewAmount)}
          </h4>
          <div className="button" onClick={() => {}}>
            Change Dates
          </div>
        </div>
          </div>
          <hr />
          <h4>{description}</h4>
          <hr />
          <h2>{reviewAmount} review{isMultiple(reviewAmount)}</h2>
          {reviewAmount > 0 && 
              reviews.map((review) => <Review key={review._key} review={review}/>)
          }
          <hr />
          <h2>Location</h2>
    </div>
  );
}

export const getServerSideProps = async (pageContext) => {
    const pageSlug = pageContext.query.slug;
    const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
        title,
        location,
        propertyType,
        mainImage,
        images,
        pricePerNight,
        beds,
        bedrooms,
        description,
        host->{
            _id,
            name,
            slug,
            image
        },
        reviews[]{
            ...,
            traveller->{
                _id,
                name,
                slug,
                image
            }
        }
    }`

    const property = await sanityClient.fetch(query, { pageSlug })

    if (!property) {
        return {
            props: null,
            notFound: true,
        }
    } else {
        return {
            props: {
                title: property.title,
                location: property.location,
                propertyType: property.propertyType,
                mainImage: property.mainImage,
                images: property.images,
                pricePerNight: property.pricePerNight,
                beds: property.beds,
                bedrooms: property.bedrooms,
                description: property.description,
                host: property.host,
                reviews: property.reviews
            }
        }
    }
}
