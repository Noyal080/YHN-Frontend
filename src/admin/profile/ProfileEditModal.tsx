import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressImage } from "@/helper/imageCompressor";
import { User } from "@/utils";
import {
  Box,
  Heading,
  HStack,
  Image,
  Input,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/authSlice";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: User;
}
const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profileData,
}) => {
  const [data, setData] = useState<User>(profileData);
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const dispatch = useDispatch();
  const { showToast } = useCommonToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    values: {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone,
      address: data.address || "",
      image: data.image || "",
    },
  });

  const handleFieldChange = (
    field: keyof User,
    value: string | number | boolean | File
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const compressedFile = await compressImage(file);
      setSelectedImage(URL.createObjectURL(compressedFile)); // Preview image
      handleFieldChange("image", compressedFile); // Update form state
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  const onSubmit = async (formData: User) => {
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && typeof value === "string") {
          data.append(key, "");
        } else {
          data.append(key, value as Blob);
        }
      });

      const res = await axiosInstance.post("/profile/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUser(res.data.data.user));

      reset();
      setSelectedImage(null);
      onClose();
      showToast({
        description: "Profile has been updated successfully",
        type: "success",
      });
    } catch (e) {
      console.log(e);
      reset(); // Reset form state
      setSelectedImage(null); // Clear selected image
      onClose(); // Close the modal
      showToast({
        description: "Error while updating profile",
        type: "error",
      });
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} size={"lg"}>
      <DialogContent>
        <DialogHeader>
          <Heading size={"lg"} fontWeight={"semibold"}>
            {" "}
            Edit Your Profile
          </Heading>
        </DialogHeader>
        <Separator size={"lg"} />
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <Field label="Name">
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      size="md"
                      onChange={(e) => {
                        handleFieldChange("name", e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
                    {errors.name && (
                      <Text textStyle="sm" color="red">
                        {errors.name.message}
                      </Text>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Field label="Email">
                    <Input
                      {...field}
                      disabled
                      size="md"
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                    />
                    {errors.email && (
                      <Text textStyle="sm" color="red">
                        {errors.email.message}
                      </Text>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Field label="Phone">
                    <Box width="full">
                      <PhoneInput
                        {...field}
                        country="np"
                        onlyCountries={["np"]}
                        inputStyle={{
                          width: "100%",
                          borderRadius: "0.375rem",
                          border: "1px solid #E2E8F0",
                        }}
                        onChange={(value) => {
                          handleFieldChange("phone", value);
                          field.onChange(value);
                        }}
                      />
                    </Box>

                    {errors.phone && (
                      <Text textStyle="sm" color="red">
                        {errors.phone.message}
                      </Text>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="address"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <Field label="Address">
                    <Input
                      {...field}
                      placeholder="Enter your address"
                      size="md"
                      onChange={(e) => {
                        handleFieldChange("address", e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
                    {errors.address && (
                      <Text textStyle="sm" color="red">
                        {errors.address.message}
                      </Text>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="image"
                control={control}
                rules={{ required: "Image URL is required" }}
                render={({ field }) => (
                  <Field label="Image URL">
                    <FileUploadRoot
                      alignItems="stretch"
                      maxFiles={1}
                      accept={["image/*"]}
                      onFileAccept={async (value) => {
                        const file = value.files[0];
                        field.onChange(file);
                        handleImageUpload(file);
                      }}
                    >
                      {(selectedImage || profileData.image) && (
                        <Image
                          src={selectedImage || profileData.image}
                          alt="Uploaded or Existing Image"
                          objectFit="contain"
                          aspectRatio={2 / 1}
                          mt={4}
                        />
                      )}
                      <FileUploadDropzone
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                        label="Drag and drop here to upload"
                        description=".png, .jpg up to 5MB"
                      />
                    </FileUploadRoot>
                    {errors.image && (
                      <Text textStyle="sm" color="red">
                        {errors.image.message}
                      </Text>
                    )}
                  </Field>
                )}
              />
            </VStack>
            <HStack justifyContent="flex-end" mt={4}>
              <Button variant={"ghost"} onClick={() => onClose()}>
                {" "}
                Cancel{" "}
              </Button>
              <Button type="submit" colorPalette={"blue"}>
                {" "}
                Submit
              </Button>
            </HStack>
          </form>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ProfileEditModal;
