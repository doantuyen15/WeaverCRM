import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { glb_sv } from "../../service";
import { useFirebase } from "../../utils/api/request";
import { toast } from "react-toastify";
 
export function AccountInfo({open, handleOpen, handleSignOut, userInfo}) {
    const [loading, setLoading] = useState(false)
    const [openchangePassword, setOpenChangePassword] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (!open) {
      setLoading(false)
      setOpenChangePassword(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }, [open])
  

  const handleChangePassword = () => {
    setLoading(true)
    useFirebase('change_password', {oldPassword, newPassword})
      .then((res) => {
        toast.success('Change password succesful!')
      })
      .catch((err) => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }
 
  return (
    <>
      <Dialog
        size="md"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[28rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray" className="mb-2 text-center">
              Account Information
            </Typography>
            <div className="flex flex-row justify-between mb-2">
              <Typography className="-mb-2" variant="h6">
                Account name
              </Typography>
              <Typography className="-mb-2 font-bold" variant="h6">
                {userInfo.displayName}
              </Typography>
            </div>
            <div className="flex flex-row justify-between mb-2">
              <Typography className="-mb-2" variant="h6">
                Roles
              </Typography>
              <Typography className="-mb-2 font-bold" variant="h6">
                {glb_sv.roles[Number(userInfo.roles)]}
              </Typography>
            </div>
            {openchangePassword ? (
              <div className="flex flex-col gap-2">
                <Input onChange={(e) => setOldPassword(e.target.value)} type="password" size="md" label="Old password"/>
                <Input onChange={(e) => setNewPassword(e.target.value)} type="password" size="md" label="New password"/>
                <Input onChange={(e) => setConfirmPassword(e.target.value)} type="password" size="md" label="Confirm new password"/>
              </div>
            ) : <></>}
          </CardBody>
          <CardFooter className="pt-0">
            {openchangePassword ? (
              <Button
                disabled={!oldPassword || !newPassword || !confirmPassword || (newPassword !== confirmPassword)}
                loading={loading}
                variant="gradient"
                onClick={() => {
                  setLoading(true)
                  handleChangePassword()
                }}
                fullWidth>
                Confirm change password
              </Button>
            ) : (
              <div className="flex flex-col gap-1">
                <Button
                  loading={loading}
                  variant="gradient"
                  onClick={() => {
                    setLoading(true)
                    handleSignOut()
                  }}
                  fullWidth>
                  Sign Out
                </Button>
                <Button
                  loading={loading}
                  variant="text"
                  onClick={() => {
                    setOpenChangePassword(prev => !prev)
                    // handleSignOut()
                  }}
                  fullWidth>
                  Change Password
                </Button>
              </div>
            )}

          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}