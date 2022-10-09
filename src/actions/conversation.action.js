import { object, string, boolean, array } from "yup";
import { ConversationApi } from "api";
import { TxtConstant } from "const";

export async function sendMessage(data) 
{
  // Sanitize input
  const dataSchema = object({
    receipientUserID: string().required(),
    message: string().required(),
  })
  data = dataSchema.validateSync(data);

  // Fetch the other's devices from server.

  // Fetch the devices linked to our device from server.

  // Compares with the devices we have.
}