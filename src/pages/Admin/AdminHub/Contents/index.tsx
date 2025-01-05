import { useState } from 'react';
import { getTopicsWithAllChapters } from '../../../../api/User/topicsApi';
import { useQuery } from '@tanstack/react-query';
import { useAccordionStore, useModalStore } from '../../../../lib/store';
import { ChaptersWithSubChaptersWithinTopic } from '../../../../lib/Types/chapters';
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Pagination,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';
import EditContentModal from '../../../../components/ui/Modals/EditContent';
import AddContentModal from '../../../../components/ui/Modals/AddContent';
import styles from './Contents.module.css';
import { LoadingDataScreen } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import SubChapters from './SubChapters';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { AccordionSummaryTheme } from '../../../../lib/constants';

const AdminContent = () => {
  const {
    editContentModalOpen,
    addContentModalOpen,
    handleAddContentModal,
    handleEditContentModal,
  } = useModalStore((state) => ({
    editContentModalOpen: state.editContentModal,
    handleEditContentModal: state.handleEditContentModal,
    addContentModalOpen: state.addContentModal,
    handleAddContentModal: state.handleAddContentModal,
  }));

  const { expanded, handleChanges } = useAccordionStore((state) => ({
    expanded: state.expanded,
    setExpanded: state.setExpanded,
    handleChanges: state.handleChanges,
  }));

  const [buttonType, setButtonType] = useState('');

  const [editData, setEditData] = useState<{
    topicId: string;
    title: string;
    subtitle: string;
    chapterId?: string;
    fileName?: string;
  }>({
    topicId: '',
    chapterId: '',
    fileName: '',
    title: '',
    subtitle: '',
  });

  const [addData, setAddData] = useState<{
    topicId?: string;
    chapterId?: string;
    chapterNum?: string;
    topicNum?: string;
    subChapterNum?: string;
    parentChapterNum?: string;
  }>({});

  const { data, isLoading } = useQuery<ChaptersWithSubChaptersWithinTopic[]>({
    queryKey: ['AllTopicsWithChapters'],
    queryFn: () => getTopicsWithAllChapters(),
  });

  const {
    page: topicPage,
    setPage: setTopicPage,
    totalPages: totalTopicPages,
    currentItems: currentTopics,
  } = handlePaginatedItems<ChaptersWithSubChaptersWithinTopic>({
    items: data || [],
  });
  const handleButtonType = (type: string) => {
    setButtonType(type);
  };

  if (isLoading) return <LoadingDataScreen />;

  return (
    <>
      <Box component={'div'} className="flex items-end justify-between mb-2">
        <Stack spacing={2}>
          <Pagination
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            shape="rounded"
            count={totalTopicPages}
            page={topicPage}
            onChange={(_event, value) => setTopicPage(value)}
            showFirstButton
            showLastButton
          />
        </Stack>

        <Box component={'div'} className="flex items-end justify-between gap-3">
          <Tooltip title="Add Topic">
            <Button
              variant="contained"
              sx={{
                background: 'green',
              }}
              onClick={() => {
                setAddData({
                  topicNum: (currentTopics.length + 1).toString(),
                });
                handleButtonType('add-topic');
                handleAddContentModal();
              }}
              endIcon={<Add />}
              aria-describedby="add-topic"
            >
              Add Topic
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Box component={'div'} className="flex flex-col gap-3">
        {data &&
          currentTopics.map((topic) => (
            <Box key={topic.id}>
              <Accordion
                slotProps={{ transition: { unmountOnExit: true } }}
                expanded={expanded === `topic-${topic.id.toString()}`}
                onChange={handleChanges(`topic-${topic.id.toString()}`)}
              >
                <AccordionSummary
                  aria-controls={`content-${topic.id.toString()}`}
                  id={`content-header-${topic.id.toString()}`}
                  expandIcon={
                    <Tooltip title="Expand">
                      <Add
                        sx={{
                          color: 'green',
                        }}
                      />
                    </Tooltip>
                  }
                  sx={AccordionSummaryTheme}
                >
                  <Typography variant="h5">
                    Topic {topic.id.toString()}: {topic.topictitle}
                  </Typography>

                  <Tooltip title="Edit Topic">
                    <Button
                      onClick={() => {
                        setEditData({
                          topicId: topic.id.toString(),
                          title: topic.topictitle || '',
                          subtitle: topic.description || '',
                        });
                        handleButtonType('edit-topic');
                        handleEditContentModal();
                      }}
                      aria-describedby="edit-topic"
                    >
                      <PencilSquareIcon className="h-6 w-6 text-green-800" />
                    </Button>
                  </Tooltip>
                </AccordionSummary>

                <SubChapters
                  Chapters={topic.chapters}
                  styles={styles}
                  topicId={topic.id.toString()}
                  handleButtonType={handleButtonType}
                  setFileData={setEditData}
                  setAddData={setAddData}
                />
              </Accordion>
            </Box>
          ))}
      </Box>

      {addContentModalOpen && addData && (
        <AddContentModal
          open={addContentModalOpen}
          handleClose={handleAddContentModal}
          buttonType={buttonType}
          addData={addData}
        />
      )}

      {editContentModalOpen && editData && (
        <EditContentModal
          key={`${editData.chapterId}-modal-edit`}
          open={editContentModalOpen}
          handleClose={handleEditContentModal}
          editData={editData}
          buttonType={buttonType}
        />
      )}
    </>
  );
};

export default AdminContent;
