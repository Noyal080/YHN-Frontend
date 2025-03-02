import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import { Gallery, ImageInputTypes } from "@/utils/types";
import {
  Box,
  Heading,
  IconButton,
  Image,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import AddImageModal from "./Modal/AddImageModal";
import DeleteImageModal from "./Modal/DeleteImageModal";

const ImageViewSection = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState<ImageInputTypes | null>(null);
  const [addImageModal, setAddImageModal] = useState<boolean>(false);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Gallery>();
  const [refetchData, setRefetchData] = useState(false);
  const [loading, setLoading] = useState(false);
  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  useEffect(() => {
    setLoading(true);
    const fetchImageData = async () => {
      try {
        const res = await axiosInstance.get(`/gallery/${id}`);
        setGalleryData(res.data.data);
        setRefetchData(false);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setRefetchData(false);
      }
    };
    fetchImageData();
  }, [id, refetchData]);

  const handleModalClose = () => {
    setAddImageModal(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModal(false);
    setSelectedImage(undefined);
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Image", link: "/admin/gallery/images" },
        { label: `View` },
      ]}
      title={`View`}
      activeSidebarItem="Image"
    >
      {!loading ? (
        galleryData && (
          <>
            <Heading size={"2xl"}>{galleryData.title}</Heading>
            <Box display="flex" flexWrap="wrap" gap={4} mt={4}>
              {galleryData.images.map((image) => (
                <Box key={image.id} position="relative">
                  <Image
                    src={image.path}
                    alt={`Gallery Image ${image.id}`}
                    boxSize="200px"
                    objectFit="cover"
                    rounded="md"
                  />
                  {/* <IconButton
                    size="xs"
                    variant={"subtle"}
                    colorPalette={"blue"}
                    position="absolute"
                    top="5%"
                    right="5px"
                  >
                    <HiPencil />
                  </IconButton> */}

                  <IconButton
                    size="xs"
                    colorPalette={"red"}
                    variant={"surface"}
                    position="absolute"
                    top="5%"
                    right="5px"
                    onClick={() => {
                      setSelectedImage(image);
                      setDeleteModal(true);
                    }}
                  >
                    <FiTrash2 />
                  </IconButton>
                </Box>
              ))}

              <Box
                width="200px"
                height="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px dashed gray"
                rounded="md"
                cursor="pointer"
                onClick={() => setAddImageModal(true)}
              >
                <FiPlus size={40} color="gray" />
              </Box>
            </Box>
          </>
        )
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="200px"
          width="100%"
          bg="gray.50"
          borderRadius="md"
          mt={4}
        >
          <VStack gap={4}>
            <Spinner size="xl" color="blue.500" borderWidth="4px" />
          </VStack>
        </Box>
      )}
      {/* Add Modal */}
      {/* <CommonModal
        open={addImageModal}
        onOpenChange={() => handleModalClose()}
        title={"Add Image"}
        onButtonClick={() => handleAddImage()}
        type="primary"
        buttonName="Add Image"
      >
        <FileUploadRoot
          alignItems="stretch"
          maxFiles={20}
          accept={["image/*"]}
          onFileAccept={(value) => {
            handleImageUpload(value.files);
          }}
        >
          <FileUploadDropzone label="Drag and drop images here to upload" />
        </FileUploadRoot>
        {miniLoading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="200px"
            width="100%"
            bg="gray.50"
            borderRadius="md"
            mt={4}
          >
            <VStack gap={4}>
              <Spinner size="lg" color="blue.500" borderWidth="4px" />
              <Text fontSize="md" color="gray.600">
                Uploading...
              </Text>
            </VStack>
          </Box>
        ) : (
          previewImages.length > 0 && (
            <SimpleGrid
              columns={[2, 3, 5]} // Responsive columns
              gap={4}
              mt={4}
            >
              {previewImages.map((src, index) => (
                <Box
                  key={index}
                  position="relative"
                  borderRadius="md"
                  overflow="hidden"
                  bg="gray.100"
                  _hover={{
                    transform: "scale(1.02)",
                    transition: "transform 0.2s",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    objectFit="cover"
                    height="150px"
                    width="100%"
                  />
                </Box>
              ))}
            </SimpleGrid>
          )
        )}
      </CommonModal> */}

      {/* DeleteModal */}
      {/* <CommonModal
        open={deleteModal}
        onOpenChange={() => handleDeleteModalClose()}
        title={"Delete Image"}
        onButtonClick={() => handleDeleteImage()}
      >
        <Text fontSize={"md"} fontWeight={"semi-bold"} mb={2}>
          {" "}
          Are you sure you want to delete this image?{" "}
        </Text>
        <Image
          boxSize="200px"
          objectFit="cover"
          rounded="md"
          src={selectedImage?.path}
        />
      </CommonModal> */}

      <AddImageModal
        isOpen={addImageModal}
        onClose={handleModalClose}
        galleryId={id}
        onSuccess={() => setRefetchData(true)}
      />

      {/* Delete Image Modal */}
      <DeleteImageModal
        isOpen={deleteModal}
        onClose={handleDeleteModalClose}
        selectedImage={selectedImage}
        galleryId={id}
        onSuccess={() => setRefetchData(true)}
      />
    </AdminLayout>
  );
};

export default ImageViewSection;
