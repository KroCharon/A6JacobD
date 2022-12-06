import { Card, Button, Placeholder } from "react-bootstrap";
import useSWR from "swr";
import Error from "next/error";
import Link from "next/link";

export default function ArtworkCard(props) {
  const { data, err } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`
  );
  const URL = `/artwork/${props.objectID}`;
  if (!data) return <div>loading...</div>;
  else if (data) {
    return (
      <>
        <Card style={{ width: "20rem" }}>
          {data.primaryImageSmall ? (
            <Card.Img variant="top" src={data.primaryImageSmall} />
          ) : (
            <Card.Img
              variant="top"
              src="https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
            />
          )}

          <Card.Body>
            <Card.Title className="text-dark">{data.title || "N/A"}</Card.Title>
            <Card.Text className="text-dark">
              <strong>Date: </strong> {data.objectDate || "N/A"}
              <br />
              <strong>Classification: </strong> {data.classification || "N/A"}
              <br />
              <strong>Medium: </strong> {data.medium || "N/A"}
              <br />
            </Card.Text>
            <Link passHref legacyBehavior href={URL}>
              <Button variant="dark">
                <strong>ID: </strong>
                {props.objectID}
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    );
  } else return <Error statusCode={404} />;
}
