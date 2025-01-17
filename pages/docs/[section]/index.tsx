import Head from "next/head";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import hydrate from "next-mdx-remote/hydrate";
import { TableOfContents } from "../../../components/docs/tableOfContents";
import { PageNavigation } from "../../../components/pageNavigation";
import * as components from "../../../components/docs";
import { loadMdxFile, getStaticMdxPaths } from "../../../utils/mdxUtils";

export default function DocPage({ pageProps }) {
  const { source, frontMatter, path, breadcrumbs } = pageProps;
  const content = hydrate(source, { components });

  return (
    <>
      <Head>
        <title>Grouparoo Docs: {frontMatter.title}</title>
        <meta name="description" content={frontMatter.pullQuote} />
        <link rel="canonical" href={`https://www.grouparoo.com${path}`} />
      </Head>

      <Container>
        {path !== "/docs/index" ? (
          <Breadcrumb>
            {breadcrumbs.map(({ title, path }, idx) => (
              <Breadcrumb.Item key={idx} href={path}>
                {title}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        ) : null}
        <Row>
          <Col className="d-none d-md-block">
            <TableOfContents />
            <div
              style={{
                position: "sticky",
                top: 10,
              }}
            >
              <PageNavigation />
            </div>
          </Col>

          <Col className="d-md-none">
            <PageNavigation />
            <br />
          </Col>

          <Col
            xl={9}
            lg={9}
            md={8}
            sm={12}
            xs={12}
            className="documentationPage"
          >
            <h1>{frontMatter.title}</h1>
            <small>
              <em>Last Updated: {frontMatter.date}</em>
            </small>
            <hr />
            <div>{content}</div>
            <components.HavingProblems />
          </Col>

          <Col className="d-md-none">
            <TableOfContents />
          </Col>
        </Row>
      </Container>
      <br />
      <br />
    </>
  );
}

export async function getStaticProps({ params }) {
  let dirParts = ["docs", params.section, params.page, params.subpage];
  dirParts = `${dirParts.filter((x) => x).join("/")}.mdx`.split("/");

  const { source, frontMatter, path, breadcrumbs } = await loadMdxFile(
    dirParts,
    components
  );

  return { props: { source, frontMatter, path, breadcrumbs } };
}

export async function getStaticPaths(args: { depth: number }) {
  const depth = args.depth || 1;
  return getStaticMdxPaths(["docs"], depth);
}
