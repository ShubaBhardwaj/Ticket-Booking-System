import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class TicketDto extends BaseDto {
  static schema = Joi.object({
    id: Joi.number().integer().positive().required(),
    name: Joi.string().min(2).max(100).required(),
  });
}

export default TicketDto;
