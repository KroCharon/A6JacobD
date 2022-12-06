/*********************************************************************************
 * WEB422 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
 * assignment has been copied manually or electronically from any other source (including web sites) or
 * distributed to other students.
 *
 * Name: Jacob Downarowicz Student ID: 135396208 Date: 12/5/2022
 *
 * Vercel App (Deployed) Link: _____________________________________________________
 *
 ********************************************************************************/
import validObjectIDList from "../../public/data/validObjectIDList.json";
import { useRouter } from "next/router";
import Error from "next/error";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import ArtworkCard from "../../components/ArtworkCard";

export default function Artwork() {
  const PER_PAGE = 12;
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1);

  const { data, err } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
  );

  useEffect(() => {
    if (data) {
      let results = [];
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (err) return <Error statusCode={404} />;
  if (!data) return <div>Loading...</div>;

  function previousPage() {
    if (page > 1) setPage((pageNum) => pageNum - 1);
  }
  function nextPage() {
    if (page < artworkList.length) setPage((pageNum) => pageNum + 1);
  }

  if (!finalQuery)
    return (
      <>
        <Error statusCode={404} />
      </>
    );
  else if (!artworkList)
    return (
      <>
        <div>
          <p>Loading...</p>
        </div>
      </>
    );
  else if (data)
    return (
      <>
        <Row className="gy-4">
          {artworkList?.length > 0 ? (
            artworkList[page - 1]?.map((objectIDs) => (
              <Col lg={3} key={objectIDs}>
                <ArtworkCard objectID={objectIDs} />
              </Col>
            ))
          ) : (
            <>
              <Card>
                <Card.Body>
                  <Card.Title className="text-dark">
                    {"Nothing Here..."}
                  </Card.Title>
                  <Card.Text className="text-dark">
                    Try searching for something else.
                  </Card.Text>
                </Card.Body>
              </Card>
            </>
          )}
        </Row>

        {artworkList.length > 0 ? (
          <Row>
            <Col>
              <Pagination className="justify-content-center mt-5">
                <Pagination.First onClick={previousPage} />
                <Pagination.Item>{page}</Pagination.Item>
                <Pagination.Last onClick={nextPage} />
              </Pagination>
            </Col>
          </Row>
        ) : null}
      </>
    );
  else if (!artworkList)
    return (
      <>
        <Error statusCode={404} />
      </>
    );
  else return <Error statusCode={404} />;
}
