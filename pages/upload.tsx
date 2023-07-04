import AddFile from "@/components/AddFile";
import Head from "next/head";
import React from "react";

export default function upload() {
  return (
    <>
      <Head>
        <title>File Upload</title>
        <meta name="description" content="iNotes is notes web application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto mb-2 px-5 pt-20">
        <AddFile />
        <div className="-m-4 flex flex-wrap">
          {/* {notes.length > 0 ? (
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                handleNoteModalToggle={handleNoteModalToggle}
              />
            ))
          ) : (
            <div className="ml-4 pt-2">
              No notes available, click the Add Notes button to add a note.
            </div>
          )} */}
          Table
        </div>
      </div>
    </>
  );
}
