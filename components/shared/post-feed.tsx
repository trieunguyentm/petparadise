import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

const PostFeed = () => {
    return (
        <div className="flex w-full flex-col">
            <div className="w-full rounded-md p-3 bg-pink-1">
                <div className="bg-white w-full rounded-t-md p-3">
                    <div className="flex flex-row justify-between items-center pb-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>TN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-lg font-medium">@trieunguyentm</div>
                                <div className="text-xs font-thin">21/4/2024 - 10:51PM</div>
                            </div>
                        </div>
                        <div>
                            <Image
                                src={"/assets/images/settings.svg"}
                                alt="setting"
                                width={20}
                                height={20}
                            />
                        </div>
                    </div>
                    <div className="font-normal text-sm pb-4">
                        It is a long established fact that a reader will be distracted by the
                        readable content of a page when looking at its layout. The point of using
                        Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
                        opposed to using 'Content here, content here', making it look like readable
                        English.
                    </div>
                    <div className="font-normal text-sm text-blue-1">#dog #corgi</div>
                </div>
                <div className="w-full">
                    <Image src={"/assets/images/dog.png"} alt="dog" height={300} width={5000} />
                </div>
                <div className="bg-white w-full rounded-b-md p-3 flex justify-between">
                    <div className="flex items-center gap-1">
                        <Image src={"/assets/images/heart.svg"} alt="like" height={20} width={20} />
                        <div className="font-normal text-brown-1">2</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image
                            src={"/assets/images/message-circle.svg"}
                            alt="like"
                            height={20}
                            width={20}
                        />
                        <div className="font-normal text-brown-1">2</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image
                            src={"/assets/images/bookmark-check.svg"}
                            alt="like"
                            height={20}
                            width={20}
                        />
                        <div className="font-normal text-brown-1">0</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostFeed
