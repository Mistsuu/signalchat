import { object, string, boolean, array, number } from "yup";
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

  // Schema for publishing message to server.
  const requestSchema = array().of(
    object({
      type: number().required(),    // Type of message: initiate / normal
      receipientDeviceID: string().required(),
      message: string().required(),
      timestamp: number().default(Date.now())
    })
  );

  // 
}