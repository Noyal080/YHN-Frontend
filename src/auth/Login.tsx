import { Button } from "@/components/ui/button";
import { LoginFormData } from "@/utils/types";
import {
  Box,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import LoginCover from "../assets/login-cover.svg";
import Logo from "../assets/YHN_Logo.jpg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionInput = motion.create(Input);
const MotionPasswordInput = motion.create(PasswordInput);
const MotionButton = motion.create(Button);
const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });
  const { showToast } = useCommonToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await axiosInstance.post("/login", data);

      const userData = res.data.data;
      localStorage.setItem("accessToken", userData.token);
      dispatch(
        loginSuccess({
          token: userData.token,
          user: userData.user,
        })
      );

      localStorage.setItem("userData", JSON.stringify(userData.user));
      showToast({
        description: res.data.message,
        type: "success",
      });
      navigate("/admin");
    } catch (error) {
      console.log(error);

      // if (axios.isAxiosError(error) && error.response) {
      //   const errorMessage =
      //     error.response.data?.message || "An error occurred";
      //   showToast({
      //     description: errorMessage,
      //     type: "error",
      //   });
      // }
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <MotionBox
        width="85%"
        height="85%"
        bg="white"
        borderRadius="xl"
        boxShadow="2xl"
        overflow="hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex height="100%">
          <MotionBox
            width="70%"
            height="100%"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src={LoginCover}
              alt="Login Image"
              objectFit="cover"
              width="100%"
              height="100%"
              css={{
                transform: "scaleX(-1)",
              }}
            />
          </MotionBox>
          <MotionFlex
            width="45%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={8}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <VStack gap={6} align="stretch">
                <MotionBox
                  display="flex"
                  justifyContent="center"
                  width="100%"
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Image
                    src={Logo}
                    alt="Logo Image"
                    width={"50%"}
                    fit="cover"
                  />
                </MotionBox>
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight={"medium"}
                  color={"gray.700"}
                  textAlign="left"
                >
                  Login
                </Heading>

                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                  }}
                  render={({ field }) => (
                    <Box>
                      <Field label="Email">
                        <MotionInput
                          {...field}
                          placeholder="Enter your email"
                          type="email"
                          size="lg"
                          // isInvalid={!!errors.email}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                        />
                        {errors.email && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.email.message}
                          </Text>
                        )}
                      </Field>
                    </Box>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field }) => (
                    <Box>
                      <Field label="Password">
                        <MotionPasswordInput
                          {...field}
                          placeholder="Enter your password"
                          size="lg"
                          // isInvalid={!!errors.password}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        />
                        {errors.password && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.password.message}
                          </Text>
                        )}
                      </Field>
                    </Box>
                  )}
                />

                <MotionButton
                  type="submit"
                  background={"blue.600"}
                  size="lg"
                  // loading={}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Login
                </MotionButton>
              </VStack>
            </form>
          </MotionFlex>
        </Flex>
      </MotionBox>
    </Flex>
  );
};

export default Login;
