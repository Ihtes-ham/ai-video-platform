from better_profanity import profanity

profanity.load_censor_words()


def check_content(title, description):
    combined_text = f"{title} {description}"
    if profanity.contains_profanity(combined_text):
        return 'flagged'
    return 'approved'