var express = require("express");
var router = express.Router();
var util = require("util");
var utils = require("../util/utils");
var xml2js = require("xml2js");
var util = require("util");
var _ = require("underscore");
var parseXMLString = util.promisify(xml2js.parseString);
var assert = require("assert");

// Expect given request body. Otherwise, 400 with comparison is returned.
var expectXmlBody = async function (req, res, body, coverage, testname) {
  var rawBody = req.rawBody;
  var actualParsedBody, expectedParsedBody;
  try {
    rawBody = utils.coerceDateXml(rawBody);
    actualParsedBody = await parseXMLString(rawBody);
    expectedParsedBody = await parseXMLString(body);
  } catch (err) {
    res.status(400).end("XML parse failure: " + err.message);
    return;
  }

  try {
    assert.deepStrictEqual(actualParsedBody, expectedParsedBody);
    coverage[testname]++;
    res.status(201).end();
  } catch (err) {
    res.status(400).header("Content-Type", "text/plain").end(`
Expected (parsed form):
${JSON.stringify(err.expected, null, 2)}

Actual (parsed form):
${JSON.stringify(err.actual, null, 2)}

Expected (raw form):
${body}

Actual (raw form):
${rawBody}
`);
  }
};

var sendXmlBody = function (res, body) {
  res.status(200).header("Content-Type", "application/xml").end(body);
};

// sample XML bodies
var body_list = `<?xml version="1.0" encoding="utf-8"?>
<EnumerationResults ServiceEndpoint="https://myaccount.blob.core.windows.net/">
  <MaxResults>3</MaxResults>
  <Containers>
    <Container>
      <Name>audio</Name>
      <Properties>
        <Last-Modified>Wed, 26 Oct 2016 20:39:39 GMT</Last-Modified>
        <Etag>0x8CACB9BD7C6B1B2</Etag>
        <PublicAccess>container</PublicAccess>
      </Properties>
    </Container>
    <Container>
      <Name>images</Name>
      <Properties>
        <Last-Modified>Wed, 26 Oct 2016 20:39:39 GMT</Last-Modified>
        <Etag>0x8CACB9BD7C1EEEC</Etag>
      </Properties>
    </Container>
    <Container>
      <Name>textfiles</Name>
      <Properties>
        <Last-Modified>Wed, 26 Oct 2016 20:39:39 GMT</Last-Modified>
        <Etag>0x8CACB9BD7BACAC3</Etag>
      </Properties>
    </Container>
  </Containers>
  <NextMarker>video</NextMarker>
</EnumerationResults>`;

var body_list_container = `<?xml version="1.0" encoding="utf-8"?>
<EnumerationResults ContainerName="https://myaccount.blob.core.windows.net/mycontainer">
  <Blobs>
    <Blob>
      <Name>blob1.txt</Name>
      <Url>https://myaccount.blob.core.windows.net/mycontainer/blob1.txt</Url>
      <Properties>
        <Last-Modified>Wed, 09 Sep 2009 09:20:02 GMT</Last-Modified>
        <Etag>0x8CBFF45D8A29A19</Etag>
        <Content-Length>100</Content-Length>
        <Content-Type>text/html</Content-Type>
        <Content-Encoding />
        <Content-Language>en-US</Content-Language>
        <Content-MD5 />
        <Cache-Control>no-cache</Cache-Control>
        <BlobType>BlockBlob</BlobType>
        <LeaseStatus>unlocked</LeaseStatus>
      </Properties>
      <Metadata>
        <Color>blue</Color>
        <BlobNumber>01</BlobNumber>
        <SomeMetadataName>SomeMetadataValue</SomeMetadataName>
      </Metadata>
    </Blob>
    <Blob>
      <Name>blob2.txt</Name>
      <Snapshot>2009-09-09T09:20:03.0427659Z</Snapshot>
      <Url>https://myaccount.blob.core.windows.net/mycontainer/blob2.txt?snapshot=2009-09-09T09%3a20%3a03.0427659Z</Url>
      <Properties>
        <Last-Modified>Wed, 09 Sep 2009 09:20:02 GMT</Last-Modified>
        <Etag>0x8CBFF45D8B4C212</Etag>
        <Content-Length>5000</Content-Length>
        <Content-Type>application/octet-stream</Content-Type>
        <Content-Encoding>gzip</Content-Encoding>
        <Content-Language />
        <Content-MD5 />
        <Cache-Control />
        <BlobType>BlockBlob</BlobType>
      </Properties>
      <Metadata>
        <Color>green</Color>
        <BlobNumber>02</BlobNumber>
        <SomeMetadataName>SomeMetadataValue</SomeMetadataName>
        <x-ms-invalid-name>nasdf$@#$$</x-ms-invalid-name>
      </Metadata>
    </Blob>
    <Blob>
      <Name>blob2.txt</Name>
      <Snapshot>2009-09-09T09:20:03.1587543Z</Snapshot>
      <Url>https://myaccount.blob.core.windows.net/mycontainer/blob2.txt?snapshot=2009-09-09T09%3a20%3a03.1587543Z</Url>
      <Properties>
        <Last-Modified>Wed, 09 Sep 2009 09:20:02 GMT</Last-Modified>
        <Etag>0x8CBFF45D8B4C212</Etag>
        <Content-Length>5000</Content-Length>
        <Content-Type>application/octet-stream</Content-Type>
        <Content-Encoding>gzip</Content-Encoding>
        <Content-Language />
        <Content-MD5 />
        <Cache-Control />
        <BlobType>BlockBlob</BlobType>
      </Properties>
      <Metadata>
        <Color>green</Color>
        <BlobNumber>02</BlobNumber>
        <SomeMetadataName>SomeMetadataValue</SomeMetadataName>
      </Metadata>
    </Blob>
    <Blob>
      <Name>blob2.txt</Name>
      <Url>https://myaccount.blob.core.windows.net/mycontainer/blob2.txt</Url>
      <Properties>
        <Last-Modified>Wed, 09 Sep 2009 09:20:02 GMT</Last-Modified>
        <Etag>0x8CBFF45D8B4C212</Etag>
        <Content-Length>5000</Content-Length>
        <Content-Type>application/octet-stream</Content-Type>
        <Content-Encoding>gzip</Content-Encoding>
        <Content-Language />
        <Content-MD5 />
        <Cache-Control />
        <BlobType>BlockBlob</BlobType>
        <LeaseStatus>unlocked</LeaseStatus>
      </Properties>
      <Metadata>
        <Color>green</Color>
        <BlobNumber>02</BlobNumber>
        <SomeMetadataName>SomeMetadataValue</SomeMetadataName>
      </Metadata>
    </Blob>
    <Blob>
      <Name>blob3.txt</Name>
      <Url>https://myaccount.blob.core.windows.net/mycontainer/blob3.txt</Url>
      <Properties>
        <Last-Modified>Wed, 09 Sep 2009 09:20:03 GMT</Last-Modified>
        <Etag>0x8CBFF45D911FADF</Etag>
        <Content-Length>16384</Content-Length>
        <Content-Type>image/jpeg</Content-Type>
        <Content-Encoding />
        <Content-Language />
        <Content-MD5 />
        <Cache-Control />
        <x-ms-blob-sequence-number>3</x-ms-blob-sequence-number>
        <BlobType>PageBlob</BlobType>
        <LeaseStatus>locked</LeaseStatus>
      </Properties>
      <Metadata>
        <Color>yellow</Color>
        <BlobNumber>03</BlobNumber>
        <SomeMetadataName>SomeMetadataValue</SomeMetadataName>
      </Metadata>
    </Blob>
  </Blobs>
  <NextMarker />
</EnumerationResults>`;

var body_acl_container = `<?xml version="1.0" encoding="utf-8"?>
<SignedIdentifiers>
  <SignedIdentifier>
    <Id>MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=</Id>
    <AccessPolicy>
      <Start>2009-09-28T08:49:37.123Z</Start>
      <Expiry>2009-09-29T08:49:37.123Z</Expiry>
      <Permission>rwd</Permission>
    </AccessPolicy>
  </SignedIdentifier>
</SignedIdentifiers>`;

var body_properties_service = `<?xml version="1.0" encoding="utf-8"?>
<StorageServiceProperties>
    <Logging>
        <Version>1.0</Version>
        <Delete>true</Delete>
        <Read>false</Read>
        <Write>true</Write>
        <RetentionPolicy>
            <Enabled>true</Enabled>
            <Days>7</Days>
        </RetentionPolicy>
    </Logging>
    <HourMetrics>
        <Version>1.0</Version>
        <Enabled>true</Enabled>
        <IncludeAPIs>false</IncludeAPIs>
        <RetentionPolicy>
            <Enabled>true</Enabled>
            <Days>7</Days>
        </RetentionPolicy>
    </HourMetrics>
    <MinuteMetrics>
        <Version>1.0</Version>
        <Enabled>true</Enabled>
        <IncludeAPIs>true</IncludeAPIs>
        <RetentionPolicy>
            <Enabled>true</Enabled>
            <Days>7</Days>
        </RetentionPolicy>
    </MinuteMetrics>
</StorageServiceProperties>`;

var xmlService = function (coverage) {
  coverage["StorageListContainersXML"] = 0;
  coverage["StorageGetServicePropertiesXML"] = 0;
  coverage["StoragePutServicePropertiesXML"] = 0;
  coverage["StorageGetContainerACLXML"] = 0;
  coverage["StorageListBlobsXML"] = 0;
  coverage["StoragePutContainerACLXML"] = 0;
  coverage["GetSimpleXML"] = 0;
  coverage["PutSimpleXML"] = 0;
  coverage["GetWrappedXMLList"] = 0;
  coverage["PutWrappedXMLList"] = 0;
  coverage["GetEmptyXMLList"] = 0;
  coverage["PutEmptyXMLList"] = 0;
  coverage["GetEmptyWrappedXMLList"] = 0;
  coverage["PutEmptyWrappedXMLList"] = 0;
  coverage["GetXMLListAtRoot"] = 0;
  coverage["PutXMLListAtRoot"] = 0;
  coverage["GetXMLListAtRootSingle"] = 0;
  coverage["PutXMLListAtRootSingle"] = 0;
  coverage["GetEmptyXMLListAtRoot"] = 0;
  coverage["PutEmptyXMLListAtRoot"] = 0;
  coverage["GetXMLEmptyNode"] = 0;
  coverage["PutXMLEmptyNode"] = 0;
  coverage["GetRootWithRefAndNoMetaXML"] = 0;
  coverage["PutRootWithRefAndNoMetaXML"] = 0;
  coverage["GetRootWithRefAndMetaXML"] = 0;
  coverage["PutRootWithRefAndMetaXML"] = 0;
  coverage["jsonInputInXMLSwagger"] = 0;
  coverage["jsonOutputInXMLSwagger"] = 0;
  coverage["GetWithXMsText"] = 0;

  router.get("/", function (req, res, next) {
    var comp = req.query.comp;
    var restype = req.query.restype;
    switch (comp) {
      case "list":
        switch (restype) {
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/list-containers2
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/enumerating-blob-resources
          // Swagger: Service_ListContainers
          case undefined:
            sendXmlBody(res, body_list);
            coverage["StorageListContainersXML"]++;
            break;
          default:
            res.sendStatus(404);
            break;
        }
        break;
      case "properties":
        switch (restype) {
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/get-blob-service-properties
          // Swagger: Service_GetServiceProperties
          case "service":
            sendXmlBody(res, body_properties_service);
            coverage["StorageGetServicePropertiesXML"]++;
            break;
          default:
            res.sendStatus(404);
            break;
        }
        break;
      default:
        res.sendStatus(404);
        break;
    }
  });
  router.put("/", function (req, res, next) {
    var comp = req.query.comp;
    var restype = req.query.restype;
    switch (comp) {
      case "properties":
        switch (restype) {
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/set-blob-service-properties
          case "service":
            expectXmlBody(req, res, body_properties_service, coverage, "StoragePutServicePropertiesXML");
            break;
          default:
            res.sendStatus(404);
            break;
        }
        break;
      default:
        res.sendStatus(404);
        break;
    }
  });

  router.get("/mycontainer", function (req, res, next) {
    var comp = req.query.comp;
    var restype = req.query.restype;
    switch (comp) {
      case "acl":
        switch (restype) {
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/get-container-acl
          case "container":
            sendXmlBody(res, body_acl_container);
            coverage["StorageGetContainerACLXML"]++;
            break;
          default:
            res.sendStatus(404);
            break;
        }
        break;
      case "list":
        switch (restype) {
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/list-blobs
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/enumerating-blob-resources
          // Swagger: Containers_ListBlobs
          case "container":
            sendXmlBody(res, body_list_container);
            coverage["StorageListBlobsXML"]++;
            break;
          default:
            res.sendStatus(404);
            break;
        }
        break;
      default:
        res.sendStatus(404);
        break;
    }
  });
  router.put("/mycontainer", function (req, res, next) {
    var comp = req.query.comp;
    var restype = req.query.restype;
    switch (comp) {
      case "acl":
        switch (restype) {
          // https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/set-container-acl
          case "container":
            expectXmlBody(req, res, body_acl_container, coverage, "StoragePutContainerACLXML");
            break;
          default:
            res.sendStatus(404);
            break;
        }
        break;
      default:
        res.sendStatus(404);
        break;
    }
  });

  const simpleBody = `<?xml version='1.0' encoding='UTF-8'?>
<slideshow
        title="Sample Slide Show"
        date="Date of publication"
        author="Yours Truly">
    <slide type="all">
        <title>Wake up to WonderWidgets!</title>
    </slide>

    <slide type="all">
        <title>Overview</title>
        <item>Why WonderWidgets are great</item>
        <item></item>
        <item>Who buys WonderWidgets</item>
    </slide>
</slideshow>`;

  router.get("/simple", function (req, res) {
    sendXmlBody(res, simpleBody);
    coverage["GetSimpleXML"]++;
  });

  router.put("/simple", function (req, res) {
    expectXmlBody(req, res, simpleBody, coverage, "PutSimpleXML");
  });

  const wrappedListsBody = `<?xml version='1.0' encoding='UTF-8'?>
<AppleBarrel>
    <GoodApples>
        <Apple>Fuji</Apple>
        <Apple>Gala</Apple>
    </GoodApples>
    <BadApples>
        <Apple>Red Delicious</Apple>
    </BadApples>
</AppleBarrel>`;

  router.get("/wrapped-lists", function (req, res) {
    sendXmlBody(res, wrappedListsBody);
    coverage["GetWrappedXMLList"]++;
  });

  router.put("/wrapped-lists", function (req, res) {
    expectXmlBody(req, res, wrappedListsBody, coverage, "PutWrappedXMLList");
  });

  const emptyListBody = `<?xml version='1.0' encoding='UTF-8'?>
<slideshow/>`;

  router.get("/empty-list", function (req, res) {
    sendXmlBody(res, emptyListBody);
    coverage["GetEmptyXMLList"]++;
  });

  router.put("/empty-list", function (req, res) {
    expectXmlBody(req, res, emptyListBody, coverage, "PutEmptyXMLList");
  });

  const emptyWrappedListsBody = `<?xml version='1.0' encoding='UTF-8'?>
<AppleBarrel>
    <GoodApples></GoodApples>
    <BadApples/>
</AppleBarrel>`;

  router.get("/empty-wrapped-lists", function (req, res) {
    sendXmlBody(res, emptyWrappedListsBody);
    coverage["GetEmptyWrappedXMLList"]++;
  });

  router.put("/empty-wrapped-lists", function (req, res) {
    expectXmlBody(req, res, emptyWrappedListsBody, coverage, "PutEmptyWrappedXMLList");
  });

  const rootListBody = `<?xml version='1.0' encoding='UTF-8'?>
<bananas>
    <banana>
        <name>Cavendish</name>
        <flavor>Sweet</flavor>
        <expiration>2018-02-28T00:40:00.123Z</expiration>
    </banana>
    <banana>
        <name>Plantain</name>
        <flavor>Savory</flavor>
        <expiration>2018-02-28T00:40:00.123Z</expiration>
    </banana>
</bananas>`;

  router.get("/root-list", function (req, res) {
    sendXmlBody(res, rootListBody);
    coverage["GetXMLListAtRoot"]++;
  });

  router.put("/root-list", function (req, res) {
    expectXmlBody(req, res, rootListBody, coverage, "PutXMLListAtRoot");
  });

  const rootListSingleItemBody = `<?xml version='1.0' encoding='UTF-8'?>
<bananas>
    <banana>
        <name>Cavendish</name>
        <flavor>Sweet</flavor>
        <expiration>2018-02-28T00:40:00.123Z</expiration>
    </banana>
</bananas>`;

  router.get("/root-list-single-item", function (req, res) {
    sendXmlBody(res, rootListSingleItemBody);
    coverage["GetXMLListAtRootSingle"]++;
  });

  router.put("/root-list-single-item", function (req, res) {
    expectXmlBody(req, res, rootListSingleItemBody, coverage, "PutXMLListAtRootSingle");
  });

  const emptyRootListBody = `<?xml version='1.0' encoding='UTF-8'?>
<bananas/>`;

  router.get("/empty-root-list", function (req, res) {
    sendXmlBody(res, emptyRootListBody);
    coverage["GetEmptyXMLListAtRoot"]++;
  });

  router.put("/empty-root-list", function (req, res) {
    expectXmlBody(req, res, emptyRootListBody, coverage, "PutEmptyXMLListAtRoot");
  });

  const emptyChildElementBody = `<?xml version='1.0' encoding='UTF-8'?>
<banana>
  <name>Unknown Banana</name>
  <flavor></flavor>
  <expiration>2012-02-24T00:53:52.789Z</expiration>
</banana>`;

  router.get("/empty-child-element", function (req, res) {
    sendXmlBody(res, emptyChildElementBody);
    coverage["GetXMLEmptyNode"]++;
  });

  router.put("/empty-child-element", function (req, res) {
    expectXmlBody(req, res, emptyChildElementBody, coverage, "PutXMLEmptyNode");
  });

  const complexTypeRefComplexTypeWithNoXMLmeta = `<?xml version='1.0' encoding='UTF-8'?>
  <RootWithRefAndNoMeta>
    <RefToModel>
      <ID>myid</ID>
    </RefToModel>
    <Something>else</Something>
  </RootWithRefAndNoMeta>`;

  router.get("/complex-type-ref-no-meta", function (req, res) {
    coverage["GetRootWithRefAndNoMetaXML"]++;
    sendXmlBody(res, complexTypeRefComplexTypeWithNoXMLmeta);
  });

  router.put("/complex-type-ref-no-meta", function (req, res) {
    expectXmlBody(req, res, complexTypeRefComplexTypeWithNoXMLmeta, coverage, "PutRootWithRefAndNoMetaXML");
  });

  const complexTypeRefComplexTypeWithXMLmeta = `<?xml version='1.0' encoding='UTF-8'?>
  <RootWithRefAndMeta>
    <XMLComplexTypeWithMeta>
      <ID>myid</ID>
    </XMLComplexTypeWithMeta>
    <Something>else</Something>
  </RootWithRefAndMeta>`;

  router.get("/complex-type-ref-with-meta", function (req, res) {
    coverage["GetRootWithRefAndMetaXML"]++;
    sendXmlBody(res, complexTypeRefComplexTypeWithXMLmeta);
  });

  router.put("/complex-type-ref-with-meta", function (req, res) {
    expectXmlBody(req, res, complexTypeRefComplexTypeWithXMLmeta, coverage, "PutRootWithRefAndMetaXML");
  });

  router.get("/headers", function (req, res) {
    res.status(200);
    res.setHeader("Custom-HEADER", "custom-value");
    res.end();
  });

  router.put("/jsoninput", function (req, res, next) {
    if (_.isEqual(req.body, { id: 42 })) {
      coverage["jsonInputInXMLSwagger"]++;
      res.status(200).end();
    } else {
      utils.send400(res, next, "Did not like valid req " + util.inspect(req.body));
    }
  });

  router.get("/jsonoutput", function (req, res, next) {
    coverage["jsonOutputInXMLSwagger"]++;
    res.status(200).json({ id: 42 });
  });

  router.get("/x-ms-text", function (req, res, next) {
    const xmsTextXML = `<?xml version='1.0' encoding='UTF-8'?>
    <Data language="english">I am text</Data>`;
    sendXmlBody(res, xmsTextXML);
    coverage["GetWithXMsText"]++;
  });
};

xmlService.prototype.router = router;

module.exports = xmlService;
