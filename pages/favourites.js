import { favouritesAtom } from "../store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "../components/ArtworkCard";
import Error from "next/error";

export default function Favorites() {
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  return (
    <>
      <Row className="gy-4">
        {favouritesList.length == 0 ? (
          <Card className="text-dark">
            <h4>Nothing Here.</h4>
            <h6>Try adding some new artwork to the list.</h6>
          </Card>
        ) : (
          favouritesList.map((objectIDs) => (
            <Col lg={3} key={objectIDs}>
              <ArtworkCard objectID={objectIDs} />
            </Col>
          ))
        )}
      </Row>
    </>
  );
}
