def individual_serial(sample)->dict:
    return{
        "id":str(sample["_id"]),
        "name":sample["name"],
        "description":sample["description"],
        "complete":sample["complete"]
    }


def list_serial(samples)->list:
    return [individual_serial(sample) for sample in samples]