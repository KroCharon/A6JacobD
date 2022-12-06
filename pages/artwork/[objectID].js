import { useRouter } from "next/router";
import ArtworkCardDetail from "../../components/ArtworkCardDetail";
import { Row, Col } from "react-bootstrap";

export default function ObjectID(props) {
  const router = useRouter();
  let { objectID } = router.query;

  return (
    <>
      {
        <Row>
          <Col>
            <ArtworkCardDetail objectID={objectID} />
          </Col>
        </Row>
      }
    </>
  );
}
