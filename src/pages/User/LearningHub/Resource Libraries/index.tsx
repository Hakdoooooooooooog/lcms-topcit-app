import { Card, CardContent } from "@mui/material";

const ResourceLibrary = () => {
  return (
    <>
      <Card>
        <CardContent>
          <h1 className="text-4xl font-semibold mb-12">
            Learning <span className="text-green-800">Hub</span>
          </h1>
          <p>
            This is the resource library page of the Learning Hub. Here you can
            find the resources for the course you are enrolled in.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default ResourceLibrary;
