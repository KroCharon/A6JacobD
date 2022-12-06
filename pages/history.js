import { searchHistoryAtom } from "../store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { Row, Col, Card, Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import styles from "../styles/History.module.css";
import { render } from "react-dom";
export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const router = useRouter();
  let parsedHistory = [];
  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });
  function historyClicked(e, index) {
    router.push("artwork?" + searchHistory[index]);
  }

  function removeHistoryClicked(e, index) {
    e.stopPropagation();
    setSearchHistory((current) => {
      let x = [...current];
      x.splice(index, 1);
      return x;
    });
  }
  return (
    <>
      <Row>
        <Col>
          {parsedHistory.length == 0 ? (
            <Card className="text-dark">
              <h4>Nothing Here.</h4>
              <h6>Try searching for some other artwork.</h6>
            </Card>
          ) : (
            <ListGroup>
              {parsedHistory.map((history, index) => (
                <ListGroup.Item
                  action
                  onClick={(e) => historyClicked(e, index)}
                  key={index}
                  className={styles.historyListItem}
                >
                  <Row>
                    <Col>
                      {Object.keys(history).map((key) => (
                        <>
                          {key}: <strong>{history[key]}</strong>&nbsp;
                        </>
                      ))}
                    </Col>
                    <Col>
                      <Button
                        className="float-end"
                        variant="danger"
                        onClick={(e) => removeHistoryClicked(e, index)}
                      >
                        &times;
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </>
  );
}
