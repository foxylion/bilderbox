import * as React from 'react';

import { Box, Button, LinearProgress, Typography } from '@material-ui/core';
import { Image } from '../../../backend/images';
import { OneDrive } from '../../../backend/images/onedrive/OneDrive';

export const Photos: React.FC = () => {
  const [progress, setProgress] = React.useState<{ fetchedItems: number; itemsToFetch: number }>({
    fetchedItems: 0,
    itemsToFetch: 0,
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<Array<Image>>([]);

  React.useEffect(() => {
    (async () => {
      if (loading) {
        const oneDrive = new OneDrive();
        const allFiles = await oneDrive.listAllFiles((fetchedItems: number, itemsToFetch: number) => {
          setProgress({ fetchedItems, itemsToFetch });
        });
        setResult(allFiles);
        setLoading(false);
      }
    })();
  }, [loading]);
  return (
    <>
      <Typography variant="h1">Photos</Typography>
      {!loading && result.length === 0 && (
        <Button onClick={() => setLoading(true)} variant="contained" color="primary">
          Load Photos
        </Button>
      )}
      {loading && (
        <>
          <ProgressWithInfo fetchedItems={progress.fetchedItems} itemsToFetch={progress.itemsToFetch} />
        </>
      )}
      <pre>{result.length > 0 && JSON.stringify(result, undefined, 2)}</pre>
    </>
  );
};

const ProgressWithInfo: React.FC<{ fetchedItems: number; itemsToFetch: number }> = (props) => {
  const progress =
    props.fetchedItems === 0 && props.itemsToFetch === 0
      ? 0
      : props.fetchedItems / (props.fetchedItems + props.itemsToFetch);
  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="caption">
        {`${Math.round(progress)}%`} ({props.fetchedItems} found, {props.itemsToFetch} to be analyzed)
      </Typography>
    </>
  );
};
